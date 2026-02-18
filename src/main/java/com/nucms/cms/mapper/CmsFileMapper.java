package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsFileVO;
import com.nucms.cms.model.CmsMediaFolderVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * CMS 파일 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsFileMapper {

    /** 파일 그룹(마스터) 생성 */
    void insertFileGroup(CmsFileVO vo);

    /** 파일 상세 정보 등록 */
    void insertFileDetail(CmsFileVO vo);

    /** 특정 그룹의 파일 목록 조회 */
    List<CmsFileVO> selectFileList(String atchFileId);

    /** 파일 상세 정보 단건 조회 */
    CmsFileVO selectFileDetail(CmsFileVO vo);

    /** 파일 상세 정보 삭제 (Batch) */
    void deleteFileDetails(CmsFileVO vo);

    /** 파일 그룹 삭제 (마스터) */
    void deleteFileGroup(String atchFileId);

    /** 미디어 라이브러리 목록 조희 (전체 이미지/미디어 대상) */
    List<CmsFileVO> selectMediaLibraryList(CmsFileVO vo);

    /* 미디어 폴더 관리 */
    void insertMediaFolder(CmsMediaFolderVO vo);
    void updateMediaFolder(CmsMediaFolderVO vo);
    void deleteMediaFolder(String folderId);
    List<CmsMediaFolderVO> selectMediaFolderList(CmsMediaFolderVO vo);
    CmsMediaFolderVO selectMediaFolder(String folderId);
}
