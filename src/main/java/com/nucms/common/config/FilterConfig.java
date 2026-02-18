package com.nucms.common.config;

import com.nucms.common.filter.HtmlTagFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 서블릿 필터 설정 (XSS 등)
 */
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<HtmlTagFilter> htmlTagFilter() {
        FilterRegistrationBean<HtmlTagFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new HtmlTagFilter());
        registrationBean.addUrlPatterns("/api/*"); // API 요청에 대해서만 XSS 필터링 적용
        registrationBean.setOrder(1); // 보안 헤더 설정 등보다 뒤에 실행
        return registrationBean;
    }
}
