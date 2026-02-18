package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsBoardMapper;
import com.nucms.cms.model.CmsBoardMasterVO;
import com.nucms.cms.model.CmsBoardPostVO;
import com.nucms.cms.service.CmsAuditService;
import com.nucms.cms.service.CmsBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * CMS 게시판 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsBoardServiceImpl implements CmsBoardService {

    private final CmsBoardMapper boardMapper;
    private final CmsAuditService auditService; // Constructor Injection

    @Override
    public List<CmsBoardMasterVO> getBoardMasterList(CmsBoardMasterVO vo) {
        return boardMapper.selectBoardMasterList(vo);
    }

    @Override
    public CmsBoardMasterVO selectBoardMasterDetail(CmsBoardMasterVO vo) throws Exception { // 인터페이스에 추가 필요할 수도 있음. 기존엔 없었나? 파일 상단 보면 getBoardMasterList만 있고 detail은 안보임.
        // 하지만 Mapper에는 있을 것임.
        return boardMapper.selectBoardMasterDetail(vo);
    }

    @Override
    @Transactional
    public void registBoardMaster(CmsBoardMasterVO vo) {
        if (vo.getBbsId() == null || vo.getBbsId().isEmpty()) {
            vo.setBbsId("BBSMSTR_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        }
        // 기본값 설정
        if (vo.getReplyPosblAt() == null) vo.setReplyPosblAt("Y");
        if (vo.getFileAtchPosblAt() == null) vo.setFileAtchPosblAt("Y");
        if (vo.getFrstRegisterId() == null) vo.setFrstRegisterId("ADMIN");
        
        boardMapper.insertBoardMaster(vo);
        
        // 감사 로그 기록 (INSERT)
        auditService.log("INSERT", "BOARD_MASTER", vo.getBbsId(), vo.getBbsNm(), null, vo);
    }

    @Override
    @Transactional
    public void modifyBoardMaster(CmsBoardMasterVO vo) {
        // 변경 전 데이터 조회
        CmsBoardMasterVO before = boardMapper.selectBoardMasterDetail(vo);
        
        boardMapper.updateBoardMaster(vo);

        // 감사 로그 기록 (UPDATE)
        auditService.log("UPDATE", "BOARD_MASTER", vo.getBbsId(), vo.getBbsNm(), before, vo);
    }

    @Override
    @Transactional
    public void removeBoardMaster(String bbsId) {
        // 변경 전 데이터 조회
        CmsBoardMasterVO searchVO = new CmsBoardMasterVO();
        searchVO.setBbsId(bbsId);
        CmsBoardMasterVO before = boardMapper.selectBoardMasterDetail(searchVO);
        
        boardMapper.deleteBoardMaster(bbsId);

        // 감사 로그 기록 (DELETE)
        auditService.log("DELETE", "BOARD_MASTER", bbsId, before != null ? before.getBbsNm() : bbsId, before, null);
    }

    @Override
    public List<CmsBoardPostVO> getBoardPostList(CmsBoardPostVO vo) {
        return boardMapper.selectBoardPostList(vo);
    }

    @Override
    @Transactional
    public CmsBoardPostVO getBoardPost(Long nttId, boolean plusCount) {
        if (plusCount) {
            boardMapper.updateRdcnt(nttId);
        }
        return boardMapper.selectBoardPost(nttId);
    }

    @Override
    @Transactional
    public void registBoardPost(CmsBoardPostVO vo) {
        boardMapper.insertBoardPost(vo);
    }

    @Override
    @Transactional
    public void modifyBoardPost(CmsBoardPostVO vo) {
        boardMapper.updateBoardPost(vo);
    }

    @Override
    @Transactional
    public void removeBoardPost(Long nttId) {
        boardMapper.deleteBoardPost(nttId);
    }

    @Override
    public List<CmsBoardPostVO> searchGlobal(String keyword) {
        return boardMapper.selectGlobalSearchList(keyword);
    }
}
