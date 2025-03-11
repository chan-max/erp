import { defHttp } from '/@/utils/http/axios'

export enum Api {
    AutoPublish = '/api/auto-publish/list',
    AddAutoPublish = '/api/auto-publish/add',
    UpdateAutoPublish = '/api/auto-publish/update',
    DeleteAutoPublish = '/api/auto-publish/delete',
    UploadMaterial = '/api/ps-pic/upload-material',
    UploadAndPubliah = '/api/auto-publish/uploadAndPush',
    PsUpdateTemplate = '/api/ps-pic/update-template',
    PsTemplates = '/api/ps-pic/templates',
    PsTemplatesName =  '/api/ps-pic/templatesName',
    PsSetOfImages = '/api/ps-pic/set-of-images',
}



/**
 * @description: Get user menu based on id
 */

export const getAutoPublishList = (params) => {
    return defHttp.get({ url: Api.AutoPublish, params })
}


export const addAutoPublish = (params) => {
    return defHttp.post({ url: Api.AddAutoPublish, params })
}

export const updateAutoPublish = (params) => {
    return defHttp.put({ url: Api.UpdateAutoPublish, params })
}

export const updateMaterial = (data) => {
    return defHttp.post({ url: '/api/ps-pic/upload-material', data })
}

export const updateAndPublish = (data) => {
    return defHttp.post({ url: Api.UploadAndPubliah, data })
}

export const updatePsTemplate = (data) => {
    return defHttp.post({ url: Api.PsUpdateTemplate, data })
}

export const getPsTemplates = (data) => {
    return defHttp.get({ url: Api.PsTemplates, data })
}

export const getPsTemplatesName = (data) => {
    return defHttp.get({ url: Api.PsTemplatesName, data })
}

// 制作套图
export const psSetOfImages = (data) => {
    return defHttp.post({ url: Api.PsSetOfImages, data })
}

export const deleteAutoPublish = (data) => {
    return defHttp.post({
        url: Api.DeleteAutoPublish
        , data
    })
}


/* 所有已经爬取的列表 */

export const getAssetLibrary = (params) => {
    return defHttp.get({
        url: '/api/asset-library/list'
        , params
    })
}

export const deleteAssetLibrary = (params) => {
    return defHttp.post({
        url: '/api/asset-library/removeByIdList'
        , params
    })
}

export const checkAssetLibrary = (params) => {
    return defHttp.post({
        url: '/api/asset-library/checkByIdList'
        , params
    })
}

export const pullAsset = (params) => {
    return defHttp.post({
        url: '/api/asset-library/pull'
        , params
    })
}
