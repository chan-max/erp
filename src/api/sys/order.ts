// 素材库相关接口

import { defHttp } from '/@/utils/http/axios'


// Mock 数据
const mockData = [
    {
        "id": 138,
        "skcId": "805058000",
        "skuNo": "WDY1513",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY1513",
        "elementWords": "",
        "category": "夜光挂毯",
        "titleTemplate": "Epic Gears of War Wall Tapestry - Large 79*59 inch, Medium 59*51 inch & Small 37*29 inch - High-Quality Polyester Room Decor for Gamers - Perfect Gift for Friends & Family This Spring!",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要帮我写一个英文标题，要仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等），根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。",
        "gptPrompt": "\"XXX UV-Resistant Blacklight Bedroom Tapestry Wall Decor Featuring XXX Design Glow in the Dark Wall Tapestry for Living Room Dormitory Decor 79*59inches Polvester Bia Tapestries for Men or Excellent Gifts for Men or Women\"请根据模板的基础内容，结合接下来我发你的图片图案和风格，帮我写一个挂毯商品英文标题，请按照我给你发的图片顺序撰写，37*29inch 59*51inch 78*59 inch三个尺寸都要包含，后缀可以灵活一点，比如侧重适合近期节日的礼物，或适合春天送朋友的礼物，但也要注意变通，不要总是固定一个格式，不要带XXX,整体英文标题严格保持字符数量230-245之间",
        "carouselImages": "[1,2,3,4,5,6,7,8]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 2,
        "hasComposite": 2,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            5,
            9,
            36,
            18
        ],
        "updateTime": [
            2025,
            3,
            5,
            9,
            50,
            8
        ],
        "imageList": [
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/1.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/150130.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/2.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/200150.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/3.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/4.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/5.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/6.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/7.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/8.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/138/9573.png"
        ]
    },
    {
        "id": 137,
        "skcId": "762615052",
        "skuNo": "WDY1612",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY1612",
        "elementWords": "",
        "category": "夜光挂毯",
        "titleTemplate": "Star Wars Knights of the Republic Tapestry Wall Art - 37*29 inch, 59*51 inch, 78*59 inch - Stunning Polyester Fabric Decor for Bedroom and Living Room - Perfect Gift for Sci-Fi Fans and Spring Celebrations!",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要帮我写一个英文标题，要仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等），根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。",
        "gptPrompt": "\"XXX UV-Resistant Blacklight Bedroom Tapestry Wall Decor Featuring XXX Design Glow in the Dark Wall Tapestry for Living Room Dormitory Decor 79*59inches Polvester Bia Tapestries for Men or Excellent Gifts for Men or Women\"请根据模板的基础内容，结合接下来我发你的图片图案和风格，帮我写一个挂毯商品英文标题，请按照我给你发的图片顺序撰写，37*29inch 59*51inch 78*59 inch三个尺寸都要包含，后缀可以灵活一点，比如侧重适合近期节日的礼物，或适合春天送朋友的礼物，但也要注意变通，不要总是固定一个格式，不要带XXX,整体英文标题严格保持字符数量230-245之间",
        "carouselImages": "[1,2,3,4,5,6,7,8]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 2,
        "hasComposite": 2,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            5,
            9,
            36,
            17
        ],
        "updateTime": [
            2025,
            3,
            5,
            9,
            50,
            8
        ],
        "imageList": [
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/1.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/150130.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/2.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/200150.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/3.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/4.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/5.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/6.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/7.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/8.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/137/9573.png"
        ]
    },
    {
        "id": 136,
        "skcId": "807019523",
        "skuNo": "WDY1620",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY1620",
        "elementWords": "",
        "category": "夜光挂毯",
        "titleTemplate": "Stunning Minecraft-Inspired Tapestry - 1pc Large Wall Hanging for Bedroom & Living Room Decor - Available in 37*29inch, 59*51inch, 78*59inch - Polyester Material with Vibrant Ice Castle Design - Perfect Gift for Gamers and Friends This Spring!",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要帮我写一个英文标题，要仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等），根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。",
        "gptPrompt": "\"XXX UV-Resistant Blacklight Bedroom Tapestry Wall Decor Featuring XXX Design Glow in the Dark Wall Tapestry for Living Room Dormitory Decor 79*59inches Polvester Bia Tapestries for Men or Excellent Gifts for Men or Women\"请根据模板的基础内容，结合接下来我发你的图片图案和风格，帮我写一个挂毯商品英文标题，请按照我给你发的图片顺序撰写，37*29inch 59*51inch 78*59 inch三个尺寸都要包含，后缀可以灵活一点，比如侧重适合近期节日的礼物，或适合春天送朋友的礼物，但也要注意变通，不要总是固定一个格式，不要带XXX,整体英文标题严格保持字符数量230-245之间",
        "carouselImages": "[1,2,3,4,5,6,7,8]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 2,
        "hasComposite": 2,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            5,
            9,
            36,
            16
        ],
        "updateTime": [
            2025,
            3,
            5,
            9,
            50,
            8
        ],
        "imageList": [
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/1.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/150130.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/2.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/200150.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/3.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/4.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/5.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/6.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/7.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/8.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/136/9573.png"
        ]
    },
    {
        "id": 135,
        "skcId": "508944873",
        "skuNo": "WDY1616",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY1616",
        "elementWords": "",
        "category": "夜光挂毯",
        "titleTemplate": "Galactic Battle Spaceship Tapestry - 37x29 inch, 59x51 inch, 78x59 inch Large Wall Hanging for Bedroom & Living Room Decor - Stunning Polyester Artwork Perfect for Sci-Fi Lovers & Unique Gift for Friends This Spring!",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要帮我写一个英文标题，要仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等），根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。",
        "gptPrompt": "\"XXX UV-Resistant Blacklight Bedroom Tapestry Wall Decor Featuring XXX Design Glow in the Dark Wall Tapestry for Living Room Dormitory Decor 79*59inches Polvester Bia Tapestries for Men or Excellent Gifts for Men or Women\"请根据模板的基础内容，结合接下来我发你的图片图案和风格，帮我写一个挂毯商品英文标题，请按照我给你发的图片顺序撰写，37*29inch 59*51inch 78*59 inch三个尺寸都要包含，后缀可以灵活一点，比如侧重适合近期节日的礼物，或适合春天送朋友的礼物，但也要注意变通，不要总是固定一个格式，不要带XXX,整体英文标题严格保持字符数量230-245之间",
        "carouselImages": "[1,2,3,4,5,6,7,8]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 2,
        "hasComposite": 2,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            5,
            9,
            29,
            28
        ],
        "updateTime": [
            2025,
            3,
            5,
            9,
            41,
            36
        ],
        "imageList": [
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/1.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/150130.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/2.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/200150.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/3.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/4.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/5.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/6.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/7.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/8.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/135/9573.png"
        ]
    },
    {
        "id": 134,
        "skcId": "670872469",
        "skuNo": "WDY110",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY110",
        "elementWords": "",
        "category": "夜光挂毯",
        "titleTemplate": "Neon Alley UV-Resistant Blacklight Wall Tapestry - Stunning Glow in the Dark Design for Bedroom, Living Room, or Dorm Decor - Available in 37*29in, 59*51in, and 78*59in - Perfect Gift for Men and Women This Spring or for Special Occasions!",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要帮我写一个英文标题，要仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等），根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。",
        "gptPrompt": "\"XXX UV-Resistant Blacklight Bedroom Tapestry Wall Decor Featuring XXX Design Glow in the Dark Wall Tapestry for Living Room Dormitory Decor 79*59inches Polvester Bia Tapestries for Men or Excellent Gifts for Men or Women\"请根据模板的基础内容，结合接下来我发你的图片图案和风格，帮我写一个挂毯商品英文标题，请按照我给你发的图片顺序撰写，37*29inch 59*51inch 78*59 inch三个尺寸都要包含，后缀可以灵活一点，比如侧重适合近期节日的礼物，或适合春天送朋友的礼物，但也要注意变通，不要总是固定一个格式，不要带XXX,整体英文标题严格保持字符数量230-245之间",
        "carouselImages": "[1,2,3,4,5,6,7,8]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 2,
        "hasComposite": 2,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            4,
            10,
            20,
            27
        ],
        "updateTime": [
            2025,
            3,
            4,
            6,
            30,
            43
        ],
        "imageList": [
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/1.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/150130.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/2.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/200150.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/3.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/4.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/5.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/6.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/7.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/8.png",
            "https://iuufu-erp-image.oss-cn-beijing.aliyuncs.com/dev/134/9573.png"
        ]
    },
    {
        "id": 133,
        "skcId": "200487962",
        "skuNo": "WDY1573",
        "shopName": "ThreadTerrace",
        "imageFolder": "WDY1573",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "Cyberpunk Neon Tapestry featuring Mysterious Shadow Figure and Ethereal Purple Energy, Perfect for Gaming Room Decor, Wall Art for Anime Fans, Large Size 60x80 Inch, Unique Gift for Gamers and Sci-Fi Enthusiasts",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            3,
            3,
            11,
            46,
            7
        ],
        "updateTime": [
            2025,
            3,
            4,
            6,
            30,
            57
        ],
        "imageList": null
    },
    {
        "id": 132,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            28,
            9,
            30,
            47
        ],
        "updateTime": [
            2025,
            3,
            4,
            10,
            20,
            39
        ],
        "imageList": null
    },
    {
        "id": 130,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            27,
            13,
            13,
            3
        ],
        "updateTime": [
            2025,
            3,
            4,
            10,
            20,
            44
        ],
        "imageList": null
    },
    {
        "id": 129,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            38
        ],
        "updateTime": [
            2025,
            3,
            4,
            10,
            20,
            48
        ],
        "imageList": null
    },
    {
        "id": 128,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            38
        ],
        "updateTime": [
            2025,
            3,
            4,
            10,
            20,
            51
        ],
        "imageList": null
    },
    {
        "id": 127,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            37
        ],
        "updateTime": [
            2025,
            3,
            4,
            10,
            20,
            54
        ],
        "imageList": null
    },
    {
        "id": 126,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            36
        ],
        "updateTime": [
            2025,
            2,
            28,
            7,
            18,
            32
        ],
        "imageList": null
    },
    {
        "id": 125,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            35
        ],
        "updateTime": [
            2025,
            2,
            28,
            6,
            31,
            47
        ],
        "imageList": null
    },
    {
        "id": 124,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            35
        ],
        "updateTime": [
            2025,
            2,
            28,
            7,
            22,
            5
        ],
        "imageList": null
    },
    {
        "id": 122,
        "skcId": "200487962",
        "skuNo": "",
        "shopName": "ThreadTerrace",
        "imageFolder": "",
        "elementWords": "",
        "category": "挂毯",
        "titleTemplate": "",
        "gptTemplate": "你现在扮演一位亚马逊高级电商运营人员，拥有丰富的产品营销和市场推广经验。接下来，我会向你提供一张图片，你需要完成以下两个步骤: 1.关键词提取：仔细分析图片内容，提取出与商品相关的主要关键词（例如风格、用途、色彩、尺寸、特色等）。2. 标题生成：根据提取出的关键词和亚马逊电商平台的需求，生成一段吸引眼球的电商商品标题。标题需要详细描述商品信息，比如风格、用途、尺寸、卖点、适合人群等，确保标题具有足够的描述性和营销吸引力。例如，针对一张展示日式风格挂毯的图片，你可以生成如下标题：\"Japanese Style Tapestry for Cherry Blossom Art Room Decor Living Room Wall Art Room Decoration Modernism Funny Large Tapestry Wall Hanging Art Room Decorations 79*59 Inch Rich and Multi-size Room Flags Best Gift for Friends\"请你根据图片内容，依照以上要求先提取关键词，再生成相应的商品标题，需要使用英语，最后只输出商品标题。",
        "gptPrompt": "请根据这张图片主要关键词，写出一个亚马逊平台的挂毯商品的标题",
        "carouselImages": "[1,2,3,4,5,6]",
        "detailImages": "[1,2,3,4,5,6,7,8]",
        "completion": 0,
        "hasComposite": 0,
        "shopTemplate": null,
        "createTime": [
            2025,
            2,
            25,
            10,
            12,
            34
        ],
        "updateTime": [
            2025,
            2,
            28,
            6,
            43,
            56
        ],
        "imageList": null
    }
]


// 模拟分页获取分类列表
export const getOrderList = (params) => {
    const { current, size } = params;
    const start = (current - 1) * size;
    const end = start + size;
    const data = mockData.slice(start, end); // 分页逻辑
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                records: data,
                total: mockData.length, // 返回总条数
            });
        }, 500); // 模拟延迟
    });
};




// 模拟添加分类
export const addOrder = (order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder = {
                ...order,
                id: mockData.length + 1,
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
            };
            mockData.push(newOrder);
            resolve(null);
        }, 500);
    });
};

// 模拟更新分类
export const updateOrder = (order) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockData.findIndex((item) => item.id === order.id);
            if (index !== -1) {
                mockData[index] = {
                    ...mockData[index],
                    ...order,
                    updateTime: new Date().toISOString(),
                };
            }
            resolve(null);
        }, 500);
    });
};

// 模拟删除分类
export const deleteOrder = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = mockData.findIndex((item) => item.id === id);
            if (index !== -1) {
                mockData.splice(index, 1);
            }
            resolve();
        }, 500);
    });
};