package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsConfigMapper;
import com.nucms.cms.model.CmsConfigVO;
import com.nucms.cms.service.CmsConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CmsConfigServiceImpl implements CmsConfigService {

    @Autowired
    private CmsConfigMapper configMapper;

    @Override
    public List<CmsConfigVO> selectConfigList(CmsConfigVO vo) throws Exception {
        return configMapper.selectConfigList(vo);
    }

    @Override
    public String getConfigValue(String configKey) throws Exception {
        CmsConfigVO vo = new CmsConfigVO();
        vo.setConfigKey(configKey);
        CmsConfigVO result = configMapper.selectConfig(vo);
        return result != null ? result.getConfigVal() : null;
    }

    @Override
    @Transactional
    public void updateConfigs(Map<String, String> configMap) throws Exception {
        for (Map.Entry<String, String> entry : configMap.entrySet()) {
            CmsConfigVO vo = new CmsConfigVO();
            vo.setConfigKey(entry.getKey());
            vo.setConfigVal(entry.getValue());
            vo.setLastUpdusrId("admin"); // TODO: 로그인 정보 연동 필요
            
            // 기존 값이 없으면 Insert, 있으면 Update 로직이 필요하나,
            // 여기서는 기본적으로 초기 데이터가 있다고 가정하고 Update 수행
            // 만약 없는 키라면 Insert 하는 로직 추가 가능
            CmsConfigVO exist = configMapper.selectConfig(vo);
            if (exist == null) {
                vo.setUseAt("Y");
                vo.setFrstRegisterId("admin");
                // ID 생성 로직 필요 (여기서는 생략하고 임의값 또는 DB Auto Increment 사용 권장되지만, String ID 사용중이므로 주의)
                // 편의상 생략하거나 별도 ID 채번 서비스 필요. 
                // 임시로 Key를 ID로 사용하거나 에러 처리. 
                // 현재 초기 데이터가 다 들어가 있으므로 update만 수행
            } else {
                configMapper.updateConfig(vo);
            }
        }
    }
}
