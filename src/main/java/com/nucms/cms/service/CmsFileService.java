package com.nucms.cms.service;

import com.nucms.cms.model.CmsFileVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * CMS 파일 관리 서비스 인터페이스
 */
public interface CmsFileService {

    /**
     * 다중 파일 업로드 처리 (자동 리사이징 포함)
     * @param files 업로드 파일 목록
     * @param atchFileId 기존 첨부파일 ID (없으면 신규 생성)
     * @param fileCn 파일 설명
     * @return 생성/사용된 첨부파일 ID
     */
    String uploadFiles(List<MultipartFile> files, String atchFileId, String fileCn) throws Exception;

    /** 특정 그룹의 파일 목록 조회 */
    List<CmsFileVO> getFileList(String atchFileId);

    /** 파일 상세 정보 조회 */
    CmsFileVO getFileDetail(String atchFileId, int fileSn);

    /** 파일 삭제 (DB 및 물리 파일) */
    void removeFile(String atchFileId, int fileSn) throws Exception;

    /** 미디어 라이브러리 목록 조희 */
    List<CmsFileVO> getMediaLibraryList(CmsFileVO vo);
}
