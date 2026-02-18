package com.nucms.cms.scheduler;

import com.nucms.cms.mapper.CmsContentMapper;
import com.nucms.cms.model.CmsContentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * CMS 콘텐츠 예약 게시 스케줄러
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CmsSchedulingTask {

    private final CmsContentMapper contentMapper;

    /**
     * 1분마다 예약 게시 대상 처리
     * 승인(A) 상태이면서 현재 시간이 게시 시작일시 이후인 경우 게시(P) 상태로 전환
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void processScheduledPublishing() {
        log.info("예약 게시 및 종료 스케줄러 실행 시점: {}", LocalDateTime.now());

        // 1. 게시 시작 처리 (승인 -> 게시)
        CmsContentVO searchVO = new CmsContentVO();
        searchVO.setSttusCode("A");
        List<CmsContentVO> approvedList = contentMapper.selectCmsContentList(searchVO);

        LocalDateTime now = LocalDateTime.now();
        for (CmsContentVO content : approvedList) {
            if (content.getNtceBgnde() != null && content.getNtceBgnde().isBefore(now)) {
                content.setSttusCode("P");
                contentMapper.updateCmsContent(content);
                log.info("콘텐츠 자동 게시 처리: ID={}, 제목={}", content.getCntentsId(), content.getSj());
            }
        }

        // 2. 게시 종료 처리 (게시 -> 종료)
        searchVO.setSttusCode("P");
        List<CmsContentVO> publishingList = contentMapper.selectCmsContentList(searchVO);

        for (CmsContentVO content : publishingList) {
            if (content.getNtceEndde() != null && content.getNtceEndde().isBefore(now)) {
                content.setSttusCode("D");
                contentMapper.updateCmsContent(content);
                log.info("콘텐츠 자동 종료 처리: ID={}, 제목={}", content.getCntentsId(), content.getSj());
            }
        }
    }
}
