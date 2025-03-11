import { defHttp } from '/@/utils/http/axios'


export const getCrawlerPicture = (params) => {
    return defHttp.post({ url: '/api/crawlerPicture/pull', params })
}