package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsCategoryMapper;
import com.nucms.cms.service.CmsCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

/**
 * CMS 카테고리 관리 서비스 구현 클래스
 */
@Service
@RequiredArgsConstructor
public class CmsCategoryServiceImpl implements CmsCategoryService {

    private final CmsCategoryMapper categoryMapper;

    @Override
    public List<Map<String, Object>> getCategoryList() {
        return categoryMapper.selectCategoryList();
    }

    @Override
    public void registCategory(Map<String, Object> param) {
        categoryMapper.insertCategory(param);
    }

    @Override
    public void modifyCategory(Map<String, Object> param) {
        categoryMapper.updateCategory(param);
    }

    @Override
    public void removeCategory(String ctgryId) {
        categoryMapper.deleteCategory(ctgryId);
    }
}
