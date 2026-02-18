package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsAuditLogVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CmsAuditLogMapper {
    /** 로그 목록 조회 */
    List<CmsAuditLogVO> selectLogList(CmsAuditLogVO vo);
    
    /** 로그 상세 조회 */
    CmsAuditLogVO selectLog(CmsAuditLogVO vo);
    
    /** 로그 등록 */
    void insertLog(CmsAuditLogVO vo);
}
