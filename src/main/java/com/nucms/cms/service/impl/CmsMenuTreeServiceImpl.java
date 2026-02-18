package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsMenuMapper;
import com.nucms.cms.model.CmsMenuVO;
import com.nucms.cms.service.CmsMenuTreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CMS 메뉴 트리 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsMenuTreeServiceImpl implements CmsMenuTreeService {

    private final CmsMenuMapper menuMapper;

    @Override
    @Transactional
    public void saveMenuTree(List<CmsMenuVO> menuList) throws Exception {
        for (CmsMenuVO menu : menuList) {
            menuMapper.updateCmsMenu(menu);
        }
    }

    @Override
    public List<CmsMenuVO> getMenuTree() throws Exception {
        List<CmsMenuVO> allMenus = menuMapper.selectCmsMenuList(new CmsMenuVO());
        return buildTree(allMenus, null);
    }

    /**
     * 평면 리스트를 트리 구조로 변환
     */
    private List<CmsMenuVO> buildTree(List<CmsMenuVO> allMenus, String parentId) {
        List<CmsMenuVO> tree = new ArrayList<>();
        for (CmsMenuVO menu : allMenus) {
            String upperId = menu.getUpperMenuId();
            if ((parentId == null && upperId == null) || (parentId != null && parentId.equals(upperId))) {
                List<CmsMenuVO> children = buildTree(allMenus, menu.getMenuId());
                menu.setChildren(children);
                tree.add(menu);
            }
        }
        return tree;
    }
}
