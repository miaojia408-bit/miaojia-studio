// Dates, bylines and introductions transcribed from the author's supplied screenshots.
// Full articles remain linked to their publication pages, not represented as local copies.
const reports = [
  {
    title: '封闭的海岛高中，蒸发了他们半生积蓄',
    date: '2026-04-23', authors: '魏荣欢、缪佳', category: '教育 · 家庭',
    source: '极昼工作室官方澎湃号',
    url: 'https://m.thepaper.cn/newsDetail_forward_33041244',
    sourceNote: '站内展示原文导语。完整报道及配图见极昼工作室官方澎湃号；微信首发日期为 2026 年 4 月 23 日，澎湃号刊发于 4 月 27 日。',
    intro: [
      '去年高考后，珠海一批学生才知道，自己根本没有通过考试，上不了培训机构保证的复旦大学。兜了一圈，他们有人辍学进厂，有人抑郁在家。',
      '这些家庭大多是靠打拼落户珠海，父母用白手起家的经验，悄悄为孩子“买下”一条出路。当市中心在卷积分入学，买房也难以凑够分数时，他们拿出半生积蓄，选择相信高新区青鸟北附实验中学合作的特色班，认为毕竟学校还有北大的品牌效应。直到负责人跑路，总共卷走了800多万。',
      '“保录”骗局并不新，只是诱饵从海外常青藤转向国内985，选中更多刚需家庭。在珠海这座城市，不少家长相信有一套常规考学外的成功模板，想要完成复刻。他们没有留意到，在把孩子送入军事化管理的海岛校区之前，悲剧就已经埋下。'
    ]
  },
  {
    title: '3分钟扇10个巴掌，科班编剧修炼「不讲逻辑」',
    date: '2026-04-14', authors: '罗晓兰、缪佳', category: '影视 · 职业',
    source: '文学城转载',
    url: 'https://www.wenxuecity.com/news/2026/04/14/126617228.html',
    alternateUrl: 'https://info.51.ca/articles/1533227',
    alternateLabel: '备用全文 · 无忧资讯',
    sourceNote: '站内展示原文导语。完整报道见文学城转载页面；首发于极昼工作室，日期和署名以作者提供的微信截图为准。',
    intro: [
      '平台保底分账，一部短剧赚千万，消息吸引大量编剧入场。其中不少人科班出生，有人曾创作独立电影和爆款长剧，有的来自三大艺术高校，也有年级第一的戏剧影视文学在读生。他们把就业机会，押注在疯狂骤变的红利期上。',
      '短剧被学院派老师视为垃圾，要写“屌丝逆袭”和“霸道总裁爱上我”，他们得瞒着周围人。原以为的“吊打”也没发生，剧本被退回几次，编辑全都在讲节奏和情绪。专业技能失灵了，观众就是上帝，流行的形式一个月一变，不如研究扇巴掌的一千种方法。',
      '逻辑被打败了，剧爆不爆，是门玄学。在AI冲击、流量催促、行业内卷和平台垄断下，他们找到的规律很快变成废纸，好几个同样的剧在同一片场拍，同一平台上线。剧本一周出10个，情节夸张到把自己逗笑，稿子终于通过了。'
    ]
  }
];

function openReports() {
  dialog.className = 'reports-dialog';
  dialog.style.cssText = '';
  dialogBody.innerHTML = `<section class="reports-home">
    <p class="reports-kicker">文字作品 / 2026</p>
    <h2 tabindex="-1">报道与记录</h2>
    <p class="reports-intro">发表于极昼工作室的合作报道。</p>
    <div class="reports-list">${reports.map((report, index) => `
      <button class="report-entry" data-report="${index}">
        <span class="report-entry-number">0${index + 1}</span>
        <span class="report-entry-copy"><span class="report-entry-meta">${report.category} <time datetime="${report.date}">${report.date.replaceAll('-', '.')}</time></span>
        <strong>${report.title}</strong><span class="report-entry-byline">文 / ${report.authors}</span></span>
        <span class="report-entry-arrow" aria-hidden="true">↗</span>
      </button>`).join('')}</div>
  </section>`;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  dialogBody.querySelector('h2').focus({preventScroll:true});
}

function openReport(index) {
  const report = reports[index];
  if (!report) return;
  dialog.className = 'reports-dialog';
  dialog.style.cssText = '';
  dialogBody.innerHTML = `<article class="report-reading">
    <button class="reports-back" data-back-reports>← 全部报道</button>
    <p class="reports-kicker">极昼工作室 · <time datetime="${report.date}">${report.date.replaceAll('-', '.')}</time></p>
    <h2 tabindex="-1">${report.title}</h2>
    <div class="report-byline"><span>文 / ${report.authors}</span><span>编辑 / 毛翊君</span></div>
    <section class="report-prose" aria-label="原文导语"><p class="report-section-label">导语</p>${report.intro.map(p => `<p>${p}</p>`).join('')}</section>
    <div class="report-source"><div class="report-source-links"><a href="${report.url}" target="_blank" rel="noopener noreferrer">阅读全文 <span aria-hidden="true">↗</span></a>${report.alternateUrl ? `<a href="${report.alternateUrl}" target="_blank" rel="noopener noreferrer">${report.alternateLabel} <span aria-hidden="true">↗</span></a>` : ''}</div><p>${report.sourceNote}</p><span>来源：${report.source}${report.alternateUrl ? ' / 无忧资讯转载（标注来源：极昼story）' : ''}</span></div>
    <button class="report-next" data-report="${index === 0 ? 1 : 0}"><small>另一篇报道</small>${reports[index === 0 ? 1 : 0].title} →</button>
  </article>`;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  dialogBody.querySelector('h2').focus({preventScroll:true});
}
