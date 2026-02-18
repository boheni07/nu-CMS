package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsRoleMapper;
import com.nucms.cms.model.CmsRoleVO;
import com.nucms.cms.service.CmsRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CMS 역할 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsRoleServiceImpl implements CmsRoleService {

    private final CmsRoleMapper roleMapper;

    @Override
    public CmsRoleVO getCmsRole(String roleCode) {
        return roleMapper.selectCmsRole(roleCode);
    }

    @Override
    public List<CmsRoleVO> getCmsRoleList(CmsRoleVO vo) {
        return roleMapper.selectCmsRoleList(vo);
    }

    @Override
    @Transactional
    public void registCmsRole(CmsRoleVO vo) {
        roleMapper.insertCmsRole(vo);
    }

    @Override
    @Transactional
    public void modifyCmsRole(CmsRoleVO vo) {
        roleMapper.updateCmsRole(vo);
    }

    @Override
    @Transactional
    public void removeCmsRole(String roleCode) {
        roleMapper.deleteCmsRole(roleCode);
    }

    @Override
    @Transactional
    public void saveMenuRole(String roleCode, List<String> menuIds) {
        roleMapper.deleteMenuRoles(roleCode);
        if (menuIds != null) {
            for (String menuId : menuIds) {
                Map<String, String> param = new HashMap<>();
                param.put("menuId", menuId);
                param.put("roleCode", roleCode);
                roleMapper.insertMenuRole(param);
            }
        }
    }

    @Override
    public List<String> getRoleMenuIds(String roleCode) {
        return roleMapper.selectRoleMenuIds(roleCode);
    }
}
