<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <div class="relative mr-4">
        <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
        <div
          class="dot absolute"
          :class="{ reddot: !isOnline, greendot: isOnline }"
          style="top: -2px; right: -2px"
        ></div>
      </div>

      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
      <span class="ml-4" style="border-radius: 999px">
        <a-tag round :color="getRoleColor(getUserInfo.role)">
          {{ getRoleLabel(getUserInfo.role) }}
        </a-tag>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts">
// components
import { Dropdown, Menu } from "ant-design-vue";
import type { MenuInfo } from "ant-design-vue/lib/menu/src/interface";

import { defineComponent, computed, watch } from "vue";

import { DOC_URL } from "/@/settings/siteSetting";

import { useUserStore } from "/@/store/modules/user";
import { useHeaderSetting } from "/@/hooks/setting/useHeaderSetting";
import { useI18n } from "/@/hooks/web/useI18n";
import { useDesign } from "/@/hooks/web/useDesign";
import { useModal } from "/@/components/Modal";

import headerImg from "/@/assets/images/defaultAvatar.png";
import { propTypes } from "/@/utils/propTypes";
import { openWindow } from "/@/utils";

import { getRoleColor, getRoleLabel } from "/@/common/user";

import { createAsyncComponent } from "/@/utils/factory/createAsyncComponent";

type MenuEvent = "logout" | "doc";

let userStore = useUserStore();

export default defineComponent({
  name: "UserDropdown",
  components: {
    Dropdown,
    Menu,
    MenuItem: createAsyncComponent(() => import("./DropMenuItem.vue")),
    MenuDivider: Menu.Divider,
  },
  props: {
    theme: propTypes.oneOf(["dark", "light"]),
  },
  setup() {
    const { prefixCls } = useDesign("header-user-dropdown");
    const { t } = useI18n();
    const { getShowDoc } = useHeaderSetting();
    const userStore = useUserStore();
    // window.userStore = userStore
    const isOnline = computed(() => {
      return userStore?.ws.online;
    });

    const getUserInfo = computed(() => {
      let avatar = userStore.getUserInfo.avatar;
      return {
        ...userStore.getUserInfo,
        avatar: avatar || headerImg,
      };
    });

    const [register] = useModal();

    //  login out
    function handleLoginOut() {
      userStore.confirmLoginOut();
    }

    // open doc
    function openDoc() {
      openWindow(DOC_URL);
    }

    function handleMenuClick(e: MenuInfo) {
      switch (e.key as MenuEvent) {
        case "logout":
          handleLoginOut();
          break;
        case "doc":
          openDoc();
          break;
      }
    }

    return {
      getRoleLabel,
      getRoleColor,
      prefixCls,
      t,
      isOnline,
      getUserInfo,
      handleMenuClick,
      getShowDoc,
      register,
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~"@{namespace}-header-user-dropdown";

.@{prefix-cls} {
  height: @header-height;
  padding: 0 0 0 10px;
  padding-right: 10px;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
  }

  &__header {
    border-radius: 50%;
  }

  &__name {
    font-size: 14px;
  }

  &--dark {
    &:hover {
      background-color: @header-dark-bg-hover-color;
    }
  }

  &--light {
    &:hover {
      background-color: @header-light-bg-hover-color;
    }

    .@{prefix-cls}__name {
      color: @text-color-base;
    }

    .@{prefix-cls}__desc {
      color: @header-light-desc-color;
    }
  }

  &-dropdown-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #ddd;
  border-radius: 99px;
}

.reddot {
  background-color: red !important; /* 更柔和的红色 */
  box-shadow: 0 0 10px rgba(255, 111, 97, 0.6);
}

.greendot {
  background-color: rgb(0, 255, 110);
  box-shadow: 0 0 10px rgba(89, 255, 95, 0.6);
}
</style>
