package com.nucms.cms.web;

import com.nucms.cms.model.CmsBoardMasterVO;
import com.nucms.cms.model.CmsBoardPostVO;
import com.nucms.cms.service.CmsBoardService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CMS 게시판 관리 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/cms/board")
@RequiredArgsConstructor
public class CmsBoardController {

    private final CmsBoardService boardService;

    /** 게시판 마스터 목록 조회 */
    @GetMapping("/master")
    public CommonResponseDTO<List<CmsBoardMasterVO>> getMasterList(CmsBoardMasterVO vo) {
        return CommonResponseDTO.success(boardService.getBoardMasterList(vo));
    }

    /** 게시글 목록 조회 */
    @GetMapping("/{bbsId}/posts")
    public CommonResponseDTO<List<CmsBoardPostVO>> getPostList(@PathVariable("bbsId") String bbsId, CmsBoardPostVO vo) {
        vo.setBbsId(bbsId);
        return CommonResponseDTO.success(boardService.getBoardPostList(vo));
    }

    /** 게시글 상세 조회 */
    @GetMapping("/post/{nttId}")
    public CommonResponseDTO<CmsBoardPostVO> getPostDetail(@PathVariable("nttId") Long nttId) {
        return CommonResponseDTO.success(boardService.getBoardPost(nttId, true));
    }

    /** 게시판 마스터 생성 */
    @PostMapping("/master")
    public CommonResponseDTO<String> registMaster(@RequestBody CmsBoardMasterVO vo) {
        boardService.registBoardMaster(vo);
        return CommonResponseDTO.success("게시판이 생성되었습니다.");
    }

    /** 게시판 마스터 수정 */
    @PutMapping("/master/{bbsId}")
    public CommonResponseDTO<String> modifyMaster(@PathVariable("bbsId") String bbsId, @RequestBody CmsBoardMasterVO vo) {
        vo.setBbsId(bbsId);
        boardService.modifyBoardMaster(vo);
        return CommonResponseDTO.success("게시판이 수정되었습니다.");
    }

    /** 게시판 마스터 삭제 */
    @DeleteMapping("/master/{bbsId}")
    public CommonResponseDTO<String> removeMaster(@PathVariable("bbsId") String bbsId) {
        boardService.removeBoardMaster(bbsId);
        return CommonResponseDTO.success("게시판이 삭제되었습니다.");
    }

    /** 게시글 등록 */
    @PostMapping("/post")
    public CommonResponseDTO<String> registPost(@RequestBody CmsBoardPostVO vo) {
        boardService.registBoardPost(vo);
        return CommonResponseDTO.success("게시물이 등록되었습니다.");
    }

    /** 게시글 수정 */
    @PutMapping("/post")
    public CommonResponseDTO<String> modifyPost(@RequestBody CmsBoardPostVO vo) {
        boardService.modifyBoardPost(vo);
        return CommonResponseDTO.success("게시물이 수정되었습니다.");
    }

    /** 게시글 삭제 */
    @DeleteMapping("/post/{nttId}")
    public CommonResponseDTO<String> removePost(@PathVariable("nttId") Long nttId) {
        boardService.removeBoardPost(nttId);
        return CommonResponseDTO.success("게시물이 삭제되었습니다.");
    }

    /** 통합 검색 전용 API */
    @GetMapping("/search")
    public CommonResponseDTO<List<CmsBoardPostVO>> search(@RequestParam("keyword") String keyword) {
        return CommonResponseDTO.success(boardService.searchGlobal(keyword));
    }
}
