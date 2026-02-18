package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsConfigVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CmsConfigMapper {
    /** 설정 목록 조회 */
    List<CmsConfigVO> selectConfigList(CmsConfigVO vo);
    
    /** 설정 상세 조회 */
    CmsConfigVO selectConfig(CmsConfigVO vo);
    
    /** 설정 등록 */
    void insertConfig(CmsConfigVO vo);
    
    /** 설정 수정 */
    void updateConfig(CmsConfigVO vo);
    
    /** 설정 삭제 */
    void deleteConfig(CmsConfigVO vo);
}
