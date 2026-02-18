package com.nucms.common.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;

/**
 * XSS 방지를 위한 HTML Tag Filter
 */
public class HtmlTagFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(new HtmlTagRequestWrapper((HttpServletRequest) request), response);
    }

    private static class HtmlTagRequestWrapper extends HttpServletRequestWrapper {
        public HtmlTagRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        @Override
        public String getParameter(String name) {
            String value = super.getParameter(name);
            return escapeHtml(value);
        }

        @Override
        public String[] getParameterValues(String name) {
            String[] values = super.getParameterValues(name);
            if (values == null) return null;
            
            for (int i = 0; i < values.length; i++) {
                values[i] = escapeHtml(values[i]);
            }
            return values;
        }

        private String escapeHtml(String value) {
            if (value == null) return null;
            // 간단한 치환 로직 (전문 필터나 lucy-xss 도입 전 단계)
            return value
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll("\\(", "&#40;")
                    .replaceAll("\\)", "&#41;")
                    .replaceAll("'", "&#39;")
                    .replaceAll("eval\\((.*)\\)", "")
                    .replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
        }
    }
}
