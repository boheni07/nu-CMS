package com.nucms.common.aspect;

import com.nucms.cms.model.CmsAccessLogVO;
import com.nucms.cms.service.CmsAccessLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

/**
 * CMS 보안 감사 로그 기록을 위한 Aspect
 */
@Aspect
// @Component
@RequiredArgsConstructor
public class AuditLogAspect {

    private final CmsAccessLogService accessLogService;

    // CMS 컨트롤러의 등록/수정/삭제 메소드를 대상으로 함
    @Pointcut("execution(* com.nucms.cms.web.*Controller.regist*(..)) || " +
              "execution(* com.nucms.cms.web.*Controller.update*(..)) || " +
              "execution(* com.nucms.cms.web.*Controller.delete*(..)) || " +
              "execution(* com.nucms.cms.web.*Controller.save*(..)) || " +
              "execution(* com.nucms.cms.web.*Controller.rollback*(..))")
    public void auditTarget() {}

    @Before("auditTarget()")
    public void logBefore(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return;

        HttpServletRequest request = attributes.getRequest();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        CmsAccessLogVO logVO = new CmsAccessLogVO();
        
        // 현재 접속자 정보 (Spring Security)
        if (auth != null && auth.isAuthenticated()) {
            logVO.setEsntlId(auth.getName()); // 실제로는 ESNTL_ID를 매핑해야 하지만, 여기선 우선 Username 사용
        }

        logVO.setConectIp(getClientIp(request));
        logVO.setConectMethod(request.getMethod());
        logVO.setConectUrl(request.getRequestURI());
        
        // 실행 메소드 및 인자 정보 기록
        String methodName = joinPoint.getSignature().getName();
        String args = Arrays.toString(joinPoint.getArgs());
        logVO.setLogCn(String.format("Method: %s, Args: %s", methodName, args));

        accessLogService.registAccessLog(logVO);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
