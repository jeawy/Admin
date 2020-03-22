import dayjs from 'dayjs';
// 字符形式的头像 格式化保留前一位
export function avatarFormat(text) {
  return `${text}`.substring(0, 1)
}
// 时间戳格式化为 YYYY/MM/DD
export function dateFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('YYYY/MM/DD')
  } else {
    return ''
  }
}
// 时间戳格式化为 YYYY/MM/DD HH:mm:ss
export function dateTimeFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  } else {
    return ''
  }
}
// 时间格式化 HH:mm
export function dateHMSFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('HH:mm')
  } else {
    return ''
  }
}
// 油井运行状态格式化显示
export function wellStatus(code) {
  switch (code) {
    case 0:
          return "开井";
          break;
        case 1:
          return "关井";
          break;
        case 2:
          return "设备已被移除";
          break;
  }
}
// DTU连接状态格式化显示
export function dtuStatus(code) {
    switch (code) {
      case 0:
        return "连接";
        break;
      case 1:
        return "未连接";
        break;
    }
}
// 油井类别格式化显示
export function welltype(code) {
  switch (code) {
    case 0:
      return "抽油井";
      break;
    case 1:
      return "螺杆泵";
      break;
  }
}
// 告警方式格式化显示
export function alarmWay(code) {
  switch (code) {
    case 0:
      return "系统自动";
      break;
    case 1:
      return "人为手动";
      break;
  }
}
// 告警类型格式化显示
export function alarmCategory(code) {
  switch (code) {
    case 0:
      return "开关井异常";
      break;
    case 1:
      return "动液面异常";
      break;
    case 2:
      return "日产量告警";
      break;
  }
}
// 告警状态格式化显示
export function alarmStatus(code) {
  switch (code) {
    case 0:
      return "新增";
      break;
    case 1:
      return "忽略";
      break;
    case 2:
      return "关闭";
      break;
    case 3:
      return "误报";
      break;
    case 4:
      return "已处置";
      break;
  }
}
// 项目工作流格式化
export function projectStatus(code) {
  switch (code) {
    case 0:
      return '未开始'
    case 1:
      return '正在进行'
    case 2:
      return '已完成'
    case 3:
      return '超期'
    case 4:
      return '暂停'
  }
}
// 数字保留两位小数并且格式化
export function numberFormat(num) {
  return (+num).toLocaleString(undefined, {
    maximumFractionDigits: 2
  })
}
// 镜头状态
export function assetStatus(status) {
  switch (status) {
    case 0:
      return '暂停'
    case 1:
      return '未开始'
    case 2:
      return '进行中'
    case 3:
      return '审核中'
    case 4:
      return '完成'
  }
}
// 资产优先级
export function Priority(priority) {
  switch (priority) {
    case 0:
      return '正常'
    case 1:
      return '优先'
  }
}
// 任务优先级
export function taskPriority(priority) {
  switch (priority) {
    case 0:
      return '低'
    case 1:
      return '中'
    case 2:
      return '高'
  }
}
// 任务难度显示
export function taskgrade(grade) {
  switch (grade) {
    case 0:
      return 'A+';
      break
    case 1:
      return 'A';
      break
    case 2:
      return 'A-';
      break
    case 3:
      return 'B+';
      break
    case 4:
      return 'B';
      break
    case 5:
      return 'B-';
      break
    case 6:
      return 'C+';
      break
    case 7:
      return 'C';
      break
    case 8:
      return 'D+';
      break
    case 9:
      return 'D';
      break
    case 10:
      return 'E';
      break
  }
}
// 资产难度
export function Level(level) {
  switch (level) {
    case 0:
      return 'A+';
      break
    case 1:
      return 'A';
      break
    case 2:
      return 'A-';
      break
    case 3:
      return 'B+';
      break
    case 4:
      return 'B';
      break
    case 5:
      return 'B-';
      break
    case 6:
      return 'C+';
      break
    case 7:
      return 'C';
      break
    case 8:
      return 'D+';
      break
    case 9:
      return 'D';
      break
    case 10:
      return 'E';
      break
    case -1:
      return '';
      break
  }
}
// 通知是否已读
export function isRead(data) {
  switch (data) {
    case 0:
      return '未读'
      break
    case 1:
      return '已读'
      break
  }
}
// 通知的紧急程度
export function urgencyLevel(data) {
  switch (data) {
    case 0:
      return '一般'
      break
    case 1:
      return '紧急'
      break
    case 2:
      return '特急'
      break
  }
}
// 审批流程等级
export function WKLevel(data) {
  switch (data) {
    case 0:
      return '收文'
      break
    case 1:
      return '一级审批'
      break
    case 2:
      return '二级审批'
      break
    case 3:
      return '三级审批'
      break
  }
}
// 任务状态
export function taskStatus(data) {
  switch (data) {
    case 0:
      return '暂停'
    case 1:
      return '未开始'
    case 2:
      return '进行中'
    case 3:
      return '审核中'
    case 4:
      return '完成'
    case 5:
      return '超时'
    case 6:
      return '反馈中'
  }
}
// 小状态
export function taskMinStatus(data) {
  switch (data) {
    case 0:
      return 'ON_HOLD'
      break
    case 1:
      return 'IGNORE'
      break
    case 2:
      return 'PAUSE'
      break
    case 3:
      return 'NOT_STARTED'
      break
    case 4:
      return 'WAITING_TO_START'
      break
    case 5:
      return 'READY_TO_START'
      break
    case 6:
      return 'NORMAL'
      break
    case 7:
      return 'OPEN'
      break
    case 8:
      return 'IN_PROGRESS'
      break
    case 9:
      return 'OUTSOURCE'
      break
    case 10:
      return 'SUBMITTED'
      break
    case 11:
      return 'FEEDBACK'
      break
    case 12:
      return 'READED'
      break
    case 13:
      return 'TEST'
      break
    case 14:
      return 'RR'
      break
    case 15:
      return 'REDO'
      break
    case 16:
      return 'APPROVE'
      break
    case 17:
      return 'PENDING_REVIEW'
      break
    case 18:
      return 'DAILIES'
      break
    case 19:
      return 'CLIENT_REVIEW'
      break
    case 20:
      return 'CBB'
      break
    case 21:
      return 'APPROVED'
      break
    case 22:
      return 'DIRECTOR_APPROVED'
      break
    case 23:
      return 'REVISION'
      break
    case 24:
      return 'FINAL'
      break
    case 25:
      return 'DELIVERED'
      break
    case 26:
      return 'OMITTED'
      break
    case 27:
      return 'CLOSED'
      break
  }
}
// 自定义属性类别
export function attrsFilter(attrs) {
  switch (attrs) {
    case 1:
      return 'NUMBER'
      break
    case 2:
      return 'CHARACTER'
      break
    case 3:
      return 'DATE '
      break
    case 4:
      return 'BOOLEAN'
      break
    case 5:
      return 'ENUMERATE'
      break
  }
}
// 实体信息
export function entityFilter(entity) {
  switch (entity) {
    case 1:
      return '任务实体'
      break
    case 2:
      return '模板实体'
      break
    case 3:
      return '流程实体'
      break
    case 4:
      return '项目实体'
      break
    case 5:
      return '资产类别'
      break
    case 6:
      return '工种实体'
      break
    case 7:
      return '用户实体'
      break
    case 8:
      return '练习项目实体'
      break
  }
}
// 迟到状态
export function lateStatus(status) {
  switch (status) {
    case 0:
      return '否'
      break
    case 1:
      return '是'
      break
  }
}
// 早退状态
export function earlyStatus(data) {
  switch (data) {
    case 1:
      return '是'
      break
  }
}
