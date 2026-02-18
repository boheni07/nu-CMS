package com.nucms.cms.web;

import com.nucms.cms.model.CmsFileVO;
import com.nucms.cms.model.CmsMediaFolderVO;
import com.nucms.cms.service.CmsFileService;
import com.nucms.common.model.CommonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/cms/dam")
@RequiredArgsConstructor
public class CmsDamController {

    private final CmsFileService fileService;

    /** 미디어 목록 조회 */
    @GetMapping("/list")
    public CommonResponseDTO<List<CmsFileVO>> getMediaList(CmsFileVO vo) {
        return CommonResponseDTO.success(fileService.getMediaLibraryList(vo));
    }

    /** 미디어 파일 업로드 (메타데이터 포함) */
    @PostMapping("/upload")
    public CommonResponseDTO<String> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @ModelAttribute CmsFileVO metaVO) throws Exception {
        
        String atchFileId = fileService.uploadFileWithMetadata(file, metaVO);
        return CommonResponseDTO.success(atchFileId);
    }

    /* 폴더 관리 */
    
    /** 폴더 목록 조회 */
    @GetMapping("/folder")
    public CommonResponseDTO<List<CmsMediaFolderVO>> getFolderList() {
        return CommonResponseDTO.success(fileService.getFolderList());
    }

    /** 폴더 생성 */
    @PostMapping("/folder")
    public CommonResponseDTO<String> createFolder(@RequestBody CmsMediaFolderVO vo) {
        fileService.createFolder(vo.getFolderNm(), vo.getUpperFolderId());
        return CommonResponseDTO.success("폴더가 생성되었습니다.");
    }

    /** 폴더 수정 */
    @PutMapping("/folder")
    public CommonResponseDTO<String> updateFolder(@RequestBody CmsMediaFolderVO vo) {
        fileService.updateFolder(vo.getFolderId(), vo.getFolderNm(), vo.getUpperFolderId());
        return CommonResponseDTO.success("폴더가 수정되었습니다.");
    }

    /** 폴더 삭제 */
    @DeleteMapping("/folder/{folderId}")
    public CommonResponseDTO<String> deleteFolder(@PathVariable("folderId") String folderId) {
        fileService.deleteFolder(folderId);
        return CommonResponseDTO.success("폴더가 삭제되었습니다.");
    }
}
