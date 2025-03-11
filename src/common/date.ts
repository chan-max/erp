

export function formatTimeFromTimeArray(params) {

    if(!params){
        return ''
    }

    const year = params[0];
    const month = String(params[1]).padStart(2, '0');  // 补零
    const day = String(params[2]).padStart(2, '0');    // 补零
    const hours = String(params[3]).padStart(2, '0');  // 补零
    const minutes = String(params[4]).padStart(2, '0'); // 补零

    return `${year}-${month}-${day} ${hours}:${minutes}`; // 返回格式化时间
}
