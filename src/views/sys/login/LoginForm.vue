<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t("sys.login.rememberMe") }}
          </Checkbox>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t("sys.login.loginButton") }}
      </Button>
    </FormItem>
  </Form>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, computed, onMounted } from "vue";
import { Checkbox, Form, Input, Row, Col, Button } from "ant-design-vue";
import LoginFormTitle from "./LoginFormTitle.vue";
import { useI18n } from "/@/hooks/web/useI18n";
import { useMessage } from "/@/hooks/web/useMessage";
import { useUserStore } from "/@/store/modules/user";
import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from "./useLogin";
import { useDesign } from "/@/hooks/web/useDesign";

const ACol = Col;
const ARow = Row;
const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { notification, createErrorModal } = useMessage();
const { prefixCls } = useDesign("login");
const userStore = useUserStore();

const { setLoginState, getLoginState } = useLoginState();
const { getFormRules } = useFormRules();

const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const formData = reactive({
  account: "",
  password: "",
});

const { validForm } = useFormValid(formRef);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

// 在组件加载时检查本地存储
onMounted(() => {
  const savedAccount = localStorage.getItem("savedAccount");
  const savedPassword = localStorage.getItem("savedPassword");
  if (savedAccount && savedPassword) {
    formData.account = savedAccount;
    formData.password = savedPassword;
    rememberMe.value = true;
  }
});

async function handleLogin() {
  const data = await validForm();
  if (!data) return;
  try {
    loading.value = true;
    const userInfo = await userStore.login({
      password: data.password,
      username: data.account,
      mode: "none", // 不要默认的错误提示
    });
    if (userInfo) {
      notification.success({
        message: t("sys.login.loginSuccessTitle"),
        description: `${t("sys.login.loginSuccessDesc")}: ${userInfo.realName}`,
        duration: 3,
      });

      // 登录成功后，如果勾选了“记住我”，则保存账号和密码
      if (rememberMe.value) {
        localStorage.setItem("savedAccount", data.account);
        localStorage.setItem("savedPassword", data.password);
      } else {
        // 如果没有勾选“记住我”，则清除本地存储中的账号和密码
        localStorage.removeItem("savedAccount");
        localStorage.removeItem("savedPassword");
      }
    }
  } catch (error) {
    createErrorModal({
      title: t("sys.api.errorTip"),
      content: ((error as unknown) as Error).message || t("sys.api.networkExceptionMsg"),
      getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
    });
  } finally {
    loading.value = false;
  }
}
</script>
