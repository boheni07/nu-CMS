package com.nucms.cms.service;

import com.nucms.cms.model.CmsConfigVO;
import java.util.List;
import java.util.Map;

public interface CmsConfigService {
    
    /**
     * 전체 설정 목록을 조회합니다.
     * @return 설정 목록
     */
    List<CmsConfigVO> selectConfigList(CmsConfigVO vo) throws Exception;
    
    /**
     * 특정 설정값을 조회합니다.
     * @param configKey 설정키
     * @return 설정값
     */
    String getConfigValue(String configKey) throws Exception;
    
    /**
     * 설정을 대량으로 업데이트합니다.
     * @param configMap 설정키-값 맵
     */
    void updateConfigs(Map<String, String> configMap) throws Exception;
}
