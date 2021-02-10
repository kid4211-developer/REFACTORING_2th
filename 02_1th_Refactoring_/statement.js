/* <REFACTORING>
 * 1. 반복문 쪼개기 : 변수값을 누적시키는 부분을 분리함
 * 2. 문장 슬라이드하기 : 변수 초기화 문장을 변수 값 누적 CODE 바로 앞으로 옮김
 * 3. 함수 추출 하기 : 연산처리하는 부분을 별도의 함수로 빼줌
 * 4. 변수 Inline 해주기 : 굳이 선언을 통해 시작할 필요 없는 변수는 CODE중에 바로 호출해줌 */

const invoice = require('./invoices.json');
const plays = require('./plays.json');

/* statement() 안에 중첩함수로 들어가 있는 문제가 여전히 남아있음 */
function statement(invoice, plays) {
    let result = `======================================\n`;
    result += `청구 내역 <고객명 : ${invoice.customer}>\n`;
    result += `======================================\n`;

    for (let perf of invoice.performances) {
        result += ` ${playFor(perf).name}: ${krw(amountFor(perf))} (${perf.audience} 석)\n`;
    }

    result += `======================================\n`;
    result += `총액 : ${krw(totalAmount())}\n`;
    result += `적립 포인트 : ${totalVolumeCredits()} credits\n`;
    return result;

    /* 함수 추출 */
    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
            case 'tragedy':
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        result += Math.max(perf.audience - 30, 0);

        if ('comedy' === playFor(perf).type) {
            result += Math.floor(perf.audience / 5);
        }
        return result;
    }

    function krw(aNumber) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            /*         minimumFractionDigits: 2, */
        }).format(aNumber);
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }
}

const result = statement(invoice, plays);
console.log(result);
