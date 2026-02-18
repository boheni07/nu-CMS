package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsFileMapper;
import com.nucms.cms.model.CmsFileVO;
import com.nucms.cms.service.CmsFileService;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * CMS 파일 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsFileServiceImpl implements CmsFileService {

    private final CmsFileMapper fileMapper;

    @Value("${cms.file.upload-path:./uploads/cms}")
    private String uploadPath;

    @Override
    @Transactional
    public String uploadFiles(List<MultipartFile> files, String atchFileId, String fileCn) throws Exception {
        if (files == null || files.isEmpty()) return atchFileId;

        // 1. ATCH_FILE_ID 생성 (없을 경우)
        if (atchFileId == null || atchFileId.isEmpty()) {
            atchFileId = "FILE_" + UUID.randomUUID().toString().substring(0, 15).toUpperCase();
            CmsFileVO groupVO = new CmsFileVO();
            groupVO.setAtchFileId(atchFileId);
            fileMapper.insertFileGroup(groupVO);
        }

        // 2. 물리적 저장 경로 준비 (날짜별 폴더)
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Path targetDir = Paths.get(uploadPath, today);
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
        }

        // 3. 파일 순번 구하기 (기존 목록 조회)
        List<CmsFileVO> existingFiles = fileMapper.selectFileList(atchFileId);
        int fileSn = existingFiles.size();

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase();
            String storeName = UUID.randomUUID().toString() + "." + ext;
            long size = file.getSize();

            // 물리 파일 저장
            File targetFile = new File(targetDir.toFile(), storeName);
            file.transferTo(targetFile);

            // DB 상세 정보 저장
            CmsFileVO detailVO = new CmsFileVO();
            detailVO.setAtchFileId(atchFileId);
            detailVO.setFileSn(fileSn++);
            detailVO.setFileStreCours(targetDir.toString());
            detailVO.setStreFileNm(storeName);
            detailVO.setOrignlFileNm(originalName);
            detailVO.setFileExtsn(ext);
            detailVO.setFileCn(fileCn);
            detailVO.setFileSize(size);
            detailVO.setThumbAt("N");
            fileMapper.insertFileDetail(detailVO);

            // 4. 이미지인 경우 자동 썸네일 생성
            if (isImage(ext)) {
                String thumbName = "THUMB_" + storeName;
                File thumbFile = new File(targetDir.toFile(), thumbName);
                
                Thumbnails.of(targetFile)
                        .size(300, 300)
                        .toFile(thumbFile);

                CmsFileVO thumbVO = new CmsFileVO();
                thumbVO.setAtchFileId(atchFileId);
                thumbVO.setFileSn(fileSn++);
                thumbVO.setFileStreCours(targetDir.toString());
                thumbVO.setStreFileNm(thumbName);
                thumbVO.setOrignlFileNm("THUMB_" + originalName);
                thumbVO.setFileExtsn(ext);
                thumbVO.setFileCn("Thumbnail for " + originalName);
                thumbVO.setFileSize(thumbFile.length());
                thumbVO.setThumbAt("Y");
                fileMapper.insertFileDetail(thumbVO);
            }
        }

        return atchFileId;
    }

    @Override
    public List<CmsFileVO> getFileList(String atchFileId) {
        return fileMapper.selectFileList(atchFileId);
    }

    @Override
    public CmsFileVO getFileDetail(String atchFileId, int fileSn) {
        CmsFileVO vo = new CmsFileVO();
        vo.setAtchFileId(atchFileId);
        vo.setFileSn(fileSn);
        return fileMapper.selectFileDetail(vo);
    }

    @Override
    @Transactional
    public void removeFile(String atchFileId, int fileSn) throws Exception {
        CmsFileVO param = new CmsFileVO();
        param.setAtchFileId(atchFileId);
        param.setFileSns(new int[]{fileSn});
        
        CmsFileVO detail = fileMapper.selectFileDetail(param);
        if (detail != null) {
            // 물리 파일 삭제
            File physicalFile = new File(detail.getFileStreCours(), detail.getStreFileNm());
            if (physicalFile.exists()) physicalFile.delete();
            
            // DB 삭제
            fileMapper.deleteFileDetails(param);
        }
    }

    @Override
    public List<CmsFileVO> getMediaLibraryList(CmsFileVO vo) {
        return fileMapper.selectMediaLibraryList(vo);
    }

    private boolean isImage(String ext) {
        return List.of("jpg", "jpeg", "png", "gif", "bmp", "webp").contains(ext.toLowerCase());
    }
}
