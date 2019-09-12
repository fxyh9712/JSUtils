/**
 * 验证所有的身份证的合法性
 *
 * @param idcard
 *            身份证
 * @return 合法返回true，否则返回false
 */
function isValidatedAllIdcard(idcard) {
    if (idcard == null || "" == idcard) {
        return false;
    }
    let s=15;
    if (idcard.length == s) {
        return validate15IDCard(idcard);
    }
    let s1=18;
    if(idcard.length==s1) {
        return validate18Idcard(idcard);
    }
    return false;

}

/**
 * <p>
 * 判断18位身份证的合法性
 * </p>
 * 根据〖中华人民共和国国家标准GB11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。
 * 排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
 * <p>
 * 顺序码: 表示在同一地址码所标识的区域范围内，对同年、同月、同 日出生的人编定的顺序号，顺序码的奇数分配给男性，偶数分配 给女性。
 * </p>
 * <p>
 * 1.前1、2位数字表示：所在省份的代码； 2.第3、4位数字表示：所在城市的代码； 3.第5、6位数字表示：所在区县的代码；
 * 4.第7~14位数字表示：出生年、月、日； 5.第15、16位数字表示：所在地的派出所的代码；
 * 6.第17位数字表示性别：奇数表示男性，偶数表示女性；
 * 7.第18位数字是校检码：也有的说是个人信息码，一般是随计算机的随机产生，用来检验身份证的正确性。校检码可以是0~9的数字，有时也用x表示。
 * </p>
 * <p>
 * 第十八位数字(校验码)的计算方法为： 1.将前面的身份证号码17位数分别乘以不同的系数。从第一位到第十七位的系数分别为：7 9 10 5 8 4
 * 2 1 6 3 7 9 10 5 8 4 2
 * </p>
 * <p>
 * 2.将这17位数字和系数相乘的结果相加。
 * </p>
 * <p>
 * 3.用加出来和除以11，看余数是多少
 * </p>
 * 4.余数只可能有0 1 2 3 4 5 6 7 8 9 10这11个数字。其分别对应的最后一位身份证的号码为1 0 X 9 8 7 6 5 4 3
 * 2。
 * <p>
 * 5.通过上面得知如果余数是2，就会在身份证的第18位数字上出现罗马数字的Ⅹ。如果余数是10，身份证的最后一位号码就是2。
 * </p>
 *
 * @param idcard
 * @return
 */
function validate18Idcard(idcard) {
    if (idcard == null) {
        return false;
    }

    // 非18位为假
    let s=18;
    if (idcard.length != s) {
//            logger.error("身份证位数不正确!");
        return false;
    }
    // 获取前17位
    let idcard17 = idcard.substring(0, 17);

    // 前17位全部为数字
    if (!isDigital(idcard17)) {
        return false;
    }

    let provinceid = idcard.substring(0, 2);
    // 校验省份
    if (!checkProvinceid(provinceid)) {
        return false;
    }

    // 校验出生日期
    let birthday = idcard.substring(6, 14);

    let yyyy = birthday.substr(0,4),//身份证年
        mm = birthday.substr(4,2),//身份证月
        dd = birthday.substr(6,2),//身份证日
        carDate = new Date(yyyy, mm-1, dd);
    if(carDate.getFullYear() != yyyy || carDate.getMonth() != mm-1 || carDate.getDate() != dd || carDate > new Date() || carDate.getFullYear() < 1800) {
        return false;
    }


    // 获取第18位
    let idcard18Code = idcard.substring(17, 18);

    let c = idcard17.split('');

    // let sum17 = 0;

    let sum17 = getPowerSum(c);

    // 将和值与11取模得到余数进行校验码判断
    let checkCode = getCheckCodeBySum(sum17);
    if (null == checkCode) {
        return false;
    }
    // 将身份证的第18位与算出来的校码进行匹配，不相等就为假
    if (idcard18Code!=checkCode) {
        return false;
    }
    //System.out.println("正确");
    return true;
}


/**
 * 校验15位身份证
 *
 * <pre>
 * 只校验省份和出生年月日
 * </pre>
 *
 * @param idcard
 * @return
 */
function validate15IDCard(idcard) {
    if (idcard == null) {
        return false;
    }
    // 非15位为假
    let s=15;
    if (idcard.length != s) {
        return false;
    }

    // 15全部为数字
    if (!isDigital(idcard)) {
        return false;
    }

    let provinceid = idcard.substring(0, 2);
    // 校验省份
    if (!checkProvinceid(provinceid)) {
        return false;
    }

    let birthday = '19'+idcard.substring(6, 12);

    let yyyy = birthday.substr(0,4),//身份证年
        mm = birthday.substr(4,2),//身份证月
        dd = birthday.substr(6,2),//身份证日
        carDate = new Date(yyyy, mm-1, dd);
    if(carDate.getFullYear() != yyyy || carDate.getMonth() != mm-1 || carDate.getDate() != dd || carDate > new Date() || carDate.getFullYear() < 1800) {
        return false;
    }


    return true;
}

/**
 * 校验省份
 *
 * @param provinceid
 * @return 合法返回TRUE，否则返回FALSE
 */
function checkProvinceid(provinceid) {
    /**
     * <pre>
     * 省、直辖市代码表：
     *     11 : 北京  12 : 天津  13 : 河北       14 : 山西  15 : 内蒙古
     *     21 : 辽宁  22 : 吉林  23 : 黑龙江  31 : 上海  32 : 江苏
     *     33 : 浙江  34 : 安徽  35 : 福建       36 : 江西  37 : 山东
     *     41 : 河南  42 : 湖北  43 : 湖南       44 : 广东  45 : 广西      46 : 海南
     *     50 : 重庆  51 : 四川  52 : 贵州       53 : 云南  54 : 西藏
     *     61 : 陕西  62 : 甘肃  63 : 青海       64 : 宁夏  65 : 新疆
     *     71 : 台湾
     *     81 : 香港  82 : 澳门
     *     91 : 国外
     * </pre>
     */
    let cityCode = [
        "11", "12", "13", "14", "15", "21",
        "22", "23", "31", "32", "33", "34", "35", "36", "37", "41", "42",
        "43", "44", "45", "46", "50", "51", "52", "53", "54", "61", "62",
        "63", "64", "65", "71", "81", "82", "91"
    ];
    for (const id of cityCode) {
        if (id == provinceid) {
            return true;
        }
    }
    return false;
}

/**
 * 数字验证
 *
 * @param str
 * @return
 */
function isDigital(str) {
    let format = new RegExp("^[0-9]*$");
    return format.test(str);
}

/**
 * 将身份证的每位和对应位的加权因子相乘之后，再得到和值
 *
 * @param bit
 * @return
 */
function getPowerSum(bit) {
    /**
     * 每位加权因子
     */
    let power = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];

    let sum = 0;

    if (power.length != bit.length) {
        return sum;
    }

    for (let i = 0; i < bit.length; i++) {
        for (let j = 0; j < power.length; j++) {
            if (i == j) {
                sum = sum + bit[i] * power[j];
            }
        }
    }
    return sum;
}

/**
 * 将和值与11取模得到余数进行校验码判断
 *
 * @param checkCode
 * @param sum17
 * @return 校验位
 */
function getCheckCodeBySum(sum17) {
    let checkCode = null;
    switch (sum17 % 11) {
        case 10:
            checkCode = "2";
            break;
        case 9:
            checkCode = "3";
            break;
        case 8:
            checkCode = "4";
            break;
        case 7:
            checkCode = "5";
            break;
        case 6:
            checkCode = "6";
            break;
        case 5:
            checkCode = "7";
            break;
        case 4:
            checkCode = "8";
            break;
        case 3:
            checkCode = "9";
            break;
        case 2:
            checkCode = "x";
            break;
        case 1:
            checkCode = "0";
            break;
        case 0:
            checkCode = "1";
            break;
        default:
    }
    return checkCode;
}