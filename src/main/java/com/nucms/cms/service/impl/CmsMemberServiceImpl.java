package com.nucms.cms.service.impl;

import com.nucms.cms.mapper.CmsMemberMapper;
import com.nucms.cms.model.CmsMemberVO;
import com.nucms.cms.service.CmsMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * CMS 회원 관리 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class CmsMemberServiceImpl implements CmsMemberService {

    private final CmsMemberMapper memberMapper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public CmsMemberVO getCmsMember(String esntlId) {
        CmsMemberVO member = memberMapper.selectCmsMember(esntlId);
        if (member != null) {
            member.setRoleList(memberMapper.selectMemberRoleList(esntlId));
        }
        return member;
    }

    @Override
    public CmsMemberVO getCmsMemberById(String mberId) {
        CmsMemberVO member = memberMapper.selectCmsMemberById(mberId);
        if (member != null) {
            member.setRoleList(memberMapper.selectMemberRoleList(member.getEsntlId()));
        }
        return member;
    }

    @Override
    public List<CmsMemberVO> getCmsMemberList(CmsMemberVO vo) {
        return memberMapper.selectCmsMemberList(vo);
    }

    @Override
    @Transactional
    public void registCmsMember(CmsMemberVO vo) {
        // 고유 ID 생성
        vo.setEsntlId("USR_" + java.util.UUID.randomUUID().toString().substring(0, 16).replace("-", ""));
        
        // 비밀번호 암호화
        if (vo.getPassword() != null) {
            vo.setPassword(passwordEncoder.encode(vo.getPassword()));
        }
        
        memberMapper.insertCmsMember(vo);
    }

    @Override
    @Transactional
    public void modifyCmsMember(CmsMemberVO vo) {
        memberMapper.updateCmsMember(vo);
    }

    @Override
    @Transactional
    public void modifyCmsMemberStatus(String esntlId, String status) {
        CmsMemberVO vo = new CmsMemberVO();
        vo.setEsntlId(esntlId);
        vo.setMberSttusCode(status);
        memberMapper.updateCmsMemberStatus(vo);
    }

    @Override
    @Transactional
    public void saveMemberRoles(String esntlId, List<String> roleCodes) {
        memberMapper.deleteMemberRoles(esntlId);
        if (roleCodes != null) {
            for (String roleCode : roleCodes) {
                Map<String, String> param = new HashMap<>();
                param.put("esntlId", esntlId);
                param.put("roleCode", roleCode);
                memberMapper.insertMemberRole(param);
            }
        }
    }
}
