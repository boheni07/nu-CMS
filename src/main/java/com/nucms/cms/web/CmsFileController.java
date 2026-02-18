package com.nucms.cms.web;

import com.nucms.cms.model.CmsFileVO;
import com.nucms.cms.service.CmsFileService;
import com.nucms.common.model.CommonResponseDTO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

/**
 * CMS 파일 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/file")
@RequiredArgsConstructor
public class CmsFileController {

    private final CmsFileService fileService;

    /** 다중 파일 업로드 */
    @PostMapping("/upload")
    public CommonResponseDTO<String> upload(@RequestParam("files") List<MultipartFile> files,
                                            @RequestParam(value = "atchFileId", required = false) String atchFileId,
                                            @RequestParam(value = "fileCn", required = false) String fileCn) throws Exception {
        String id = fileService.uploadFiles(files, atchFileId, fileCn);
        return CommonResponseDTO.success(id);
    }

    /** 파일 목록 조회 */
    @GetMapping("/{atchFileId}")
    public CommonResponseDTO<List<CmsFileVO>> getList(@PathVariable("atchFileId") String atchFileId) {
        return CommonResponseDTO.success(fileService.getFileList(atchFileId));
    }

    /** 미디어 라이브러리 목록 조희 */
    @GetMapping("/library")
    public CommonResponseDTO<List<CmsFileVO>> getLibrary(CmsFileVO vo) {
        return CommonResponseDTO.success(fileService.getMediaLibraryList(vo));
    }

    /** 보안 파일 다운로드 / 이미지 스트리밍 */
    @GetMapping("/download/{atchFileId}/{fileSn}")
    public ResponseEntity<Resource> download(@PathVariable("atchFileId") String atchFileId,
                                             @PathVariable("fileSn") int fileSn) throws IOException {
        CmsFileVO fileVO = fileService.getFileDetail(atchFileId, fileSn);
        if (fileVO == null) return ResponseEntity.notFound().build();

        File file = new File(fileVO.getFileStreCours(), fileVO.getStreFileNm());
        if (!file.exists()) return ResponseEntity.notFound().build();

        Resource resource = new FileSystemResource(file);
        String contentType = Files.probeContentType(file.toPath());
        if (contentType == null) contentType = "application/octet-stream";

        String encodedFileName = URLEncoder.encode(fileVO.getOrignlFileNm(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                .body(resource);
    }

    /** 파일 삭제 */
    @DeleteMapping("/{atchFileId}/{fileSn}")
    public CommonResponseDTO<String> delete(@PathVariable("atchFileId") String atchFileId,
                                            @PathVariable("fileSn") int fileSn) throws Exception {
        fileService.removeFile(atchFileId, fileSn);
        return CommonResponseDTO.success("파일이 삭제되었습니다.");
    }
}
