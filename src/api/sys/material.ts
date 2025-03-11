// 素材库相关接口

import { defHttp } from '/@/utils/http/axios'


// Mock 数据
const mockData = [
    { id: 1, name: "分类1", description: "分类1描述", status: 1, createTime: "2023-10-01", updateTime: "2023-10-01" },
    { id: 2, name: "分类2", description: "分类2描述", status: 0, createTime: "2023-10-02", updateTime: "2023-10-02" },
    // 更多数据...
  ];


  // 模拟分页获取分类列表
export const getCategoryList = (params) => {
    const { current, size } = params;
    const start = (current - 1) * size;
    const end = start + size;
    const data = mockData.slice(start, end); // 分页逻辑
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          records:data,
          total: mockData.length, // 返回总条数
        });
      }, 500); // 模拟延迟
    });
  };



  // 模拟添加分类
export const addCategory = (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCategory = {
          ...category,
          id: mockData.length + 1,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        };
        mockData.push(newCategory);
        resolve(null);
      }, 500);
    });
  };
  
  // 模拟更新分类
  export const updateCategory = (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockData.findIndex((item) => item.id === category.id);
        if (index !== -1) {
          mockData[index] = {
            ...mockData[index],
            ...category,
            updateTime: new Date().toISOString(),
          };
        }
        resolve(null);
      }, 500);
    });
  };
  
  // 模拟删除分类
  export const deleteCategory = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockData.findIndex((item) => item.id === id);
        if (index !== -1) {
          mockData.splice(index, 1);
        }
        resolve(null);
      }, 500);
    });
  };


export const getMaterialConfigApi = (params) => {
  return defHttp.get({ url:'/api/asset-library/getPictureParams', params })
  return new Promise((resolve,reject) => {
    setTimeout(() => {

      let data = {
        crawlerWebsite: [
          {
            label: "pinterest",
            value: 1,
            operation: {
              searchContent: true,
              downloadCount: true,
            }
          },
          {
            label: "deviantrat",
            value: 2,
            operation: {
              searchContent: true,
              downloadCount: true,
            }
          },
      
          {
            label: "测试网站（请勿使用）",
            value: 999,
            operation: {
              searchContent: true,
              downloadCount: true,
              likedCount:true,
              category:true,
            }
          },
        ],
        hotSellers: []
      }



      resolve(data)
    }, 2000);
  })


}

export function getLabelList(params) {
  return defHttp.get({ url: '/api/label',params })
}

export function addLabel(data) {
  return defHttp.post({ url: '/api/label/insert', data })
}

export function deleteLabel(data) {
  return defHttp.post({ url: `/api/label/delete`, data })
}