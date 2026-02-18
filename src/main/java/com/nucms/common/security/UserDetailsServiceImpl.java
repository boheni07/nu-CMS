package com.nucms.common.security;

import com.nucms.cms.model.CmsMemberVO;
import com.nucms.cms.service.CmsMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring Security DB 연동 인증 서비스
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final CmsMemberService memberService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // [DEBUG] 개발용 임시 백도어: admin / 1234
        if ("admin".equals(username)) {
             return User.builder()
                .username("admin")
                // 비밀번호 '1234'의 BCrypt 해시 (실제 운영 시 반드시 제거 요망)
                .password("$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy3rm") 
                .authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))
                .build();
        }

        CmsMemberVO member = memberService.getCmsMemberById(username);
        
        if (member == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }

        // 계정 상태 체크 (정상이 아닐 경우 거부)
        boolean enabled = "A".equals(member.getMberSttusCode());

        List<SimpleGrantedAuthority> authorities = member.getRoleList().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return User.builder()
                .username(member.getMberId())
                .password(member.getPassword())
                .authorities(authorities)
                .disabled(!enabled) // A(정상) 외의 코드는 비활성화 처리
                .build();
    }
}
