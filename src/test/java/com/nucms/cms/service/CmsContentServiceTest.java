package com.nucms.cms.service;

import com.nucms.cms.mapper.CmsContentMapper;
import com.nucms.cms.model.CmsContentVO;
import com.nucms.cms.service.impl.CmsContentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * CMS 콘텐츠 서비스 단위 테스트 (JUnit 5 + Mockito)
 */
@ExtendWith(MockitoExtension.class)
public class CmsContentServiceTest {

    @Mock
    private CmsContentMapper contentMapper;

    @InjectMocks
    private CmsContentServiceImpl contentService;

    private CmsContentVO testVO;

    @BeforeEach
    void setUp() {
        testVO = new CmsContentVO();
        testVO.setCntentsId("TEST_001");
        testVO.setSj("테스트 제목");
        testVO.setCn("테스트 내용");
        testVO.setWrterId("admin");
        testVO.setVerNo(1);
        testVO.setSttusCode("I");
    }

    @Test
    @DisplayName("콘텐츠 등록 테스트 - 초기 버전 1 설정 확인")
    void registCmsContentTest() {
        // given
        testVO.setVerNo(0); // verNo가 0일 때 1로 설정 테스트

        // when
        contentService.registCmsContent(testVO);

        // then
        assertEquals(1, testVO.getVerNo());
        verify(contentMapper, times(1)).insertCmsContent(any(CmsContentVO.class));
    }

    @Test
    @DisplayName("콘텐츠 수정 테스트 - 아카이빙 및 버전 업 로직 확인")
    void updateCmsContentTest() {
        // given
        CmsContentVO existingVO = new CmsContentVO();
        existingVO.setCntentsId("TEST_001");
        existingVO.setVerNo(1);
        
        when(contentMapper.selectCmsContent("TEST_001")).thenReturn(existingVO);

        // when
        CmsContentVO updateVO = new CmsContentVO();
        updateVO.setCntentsId("TEST_001");
        updateVO.setSj("수정된 제목");
        contentService.updateCmsContent(updateVO);

        // then
        assertEquals(2, updateVO.getVerNo()); // 버전이 1에서 2로 증가했는지 확인
        verify(contentMapper, times(1)).insertCmsContentHist(existingVO); // 아카이빙 호출 확인
        verify(contentMapper, times(1)).updateCmsContent(updateVO); // 업데이트 호출 확인
    }

    @Test
    @DisplayName("콘텐츠 목록 조회 테스트")
    void getCmsContentListTest() {
        // given
        when(contentMapper.selectCmsContentList(any())).thenReturn(Collections.singletonList(testVO));

        // when
        List<CmsContentVO> result = contentService.getCmsContentList(new CmsContentVO());

        // then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("TEST_001", result.get(0).getCntentsId());
    }
}
