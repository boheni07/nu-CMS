package com.nucms.cms.service;

import com.nucms.cms.model.CmsBoardMasterVO;
import com.nucms.cms.model.CmsBoardPostVO;
import java.util.List;

/**
 * CMS 게시판 관리 서비스 인터페이스
 */
public interface CmsBoardService {

    /* 마스터 관리 */
    List<CmsBoardMasterVO> getBoardMasterList(CmsBoardMasterVO vo);
    CmsBoardMasterVO selectBoardMasterDetail(CmsBoardMasterVO vo) throws Exception;
    void registBoardMaster(CmsBoardMasterVO vo);
    void modifyBoardMaster(CmsBoardMasterVO vo);
    void removeBoardMaster(String bbsId);

    /* 게시글 관리 */
    List<CmsBoardPostVO> getBoardPostList(CmsBoardPostVO vo);
    CmsBoardPostVO getBoardPost(Long nttId, boolean plusCount);
    void registBoardPost(CmsBoardPostVO vo);
    void modifyBoardPost(CmsBoardPostVO vo);
    void removeBoardPost(Long nttId);

    /* 통합 검색 */
    List<CmsBoardPostVO> searchGlobal(String keyword);
}
