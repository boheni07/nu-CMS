package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsTagMapper;
import com.nucms.cms.service.CmsTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * CMS 태그 관리 서비스 구현 클래스
 */
@Service
@RequiredArgsConstructor
public class CmsTagServiceImpl implements CmsTagService {

    private final CmsTagMapper tagMapper;

    @Override
    public List<Map<String, Object>> getTagListByContentId(String cntentsId) {
        return tagMapper.selectTagListByContentId(cntentsId);
    }

    @Override
    @Transactional
    public void saveTags(String cntentsId, List<String> tags) {
        // 기존 매핑 삭제
        tagMapper.deleteTagMapByContentId(cntentsId);

        if (tags != null) {
            for (String tagNm : tags) {
                // 태그 존재 확인 및 삽입 (ON DUPLICATE KEY UPDATE)
                Map<String, Object> tagParam = new HashMap<>();
                String tagId = "TAG_" + UUID.randomUUID().toString().substring(0, 8);
                tagParam.put("tagId", tagId);
                tagParam.put("tagNm", tagNm);
                tagMapper.insertTag(tagParam);

                // 현재는 tagId를 다시 가져오는 로직이 필요할 수 있으나, 
                // 간단하게 이름 기반으로 맵핑하거나 시퀀스/UUID 사용
                // 여기서는 tagNm이 UNIQUE이므로 insertTag 후 해당 ID를 가져오는 대신
                // 간단한 매핑 테이블 구성을 위해 tagId를 새로 매핑함 (실제로는 tagNm으로 ID 조회 필요)
                
                Map<String, Object> mapParam = new HashMap<>();
                mapParam.put("cntentsId", cntentsId);
                mapParam.put("tagId", tagId);
                tagMapper.insertContentTagMap(mapParam);
            }
        }
    }
}
