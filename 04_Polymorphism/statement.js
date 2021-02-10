/* 다형성(Polymorphism)을 활용해 계산 코드 재구성하기 */
const createStatementData = require('./createStatementData.js');
const invoice = require('./invoices.json');
const plays = require('./plays.json');

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
    let result = `청구 내역 || 고객명 : ${data.customer}\n`;
    for (let perf of data.performances) {
        result += `${perf.play.name} : ${krw(perf.amount)} (${perf.audience} 석)\n`;
    }
    result += ` 총액 : ${krw(data.totalAmount)}\n`;
    result += ` 적립 포인트 : ${data.totalVolumeCredits} 점\n`;
    return result;

    /* 함수 추출 */

    function krw(aNumber) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(aNumber);
    }
}

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 <고객명 : ${data.customer}</h1>\n`;

    result += '<table>\n';
    result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';
    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>(${perf.audience} 석)</td><td>${krw(perf.amount)}</td></tr>\n`;
    }
    result += '</table>\n';
    result += ` <p>총액 : <em>${krw(data.totalAmount)}</em></p>\n`;
    result += ` <p>적립 포인트 : <em>${data.totalVolumeCredits}</em> 점</p>\n`;
    return result;

    /* 함수 추출 */

    function krw(aNumber) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(aNumber);
    }
}

const result = statement(invoice, plays);
console.log(result);
