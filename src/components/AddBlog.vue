<template>
  <div class="add_blog_box">
    <div
      class="box tr_Y"
      style="
        position: absolute;
        transition: all 0.5s;
        transform: translateY(-100px);
      "
    >
      <v-form-render
        :form-json="formJson"
        :form-data="formData"
        :option-data="optionData"
        ref="vFormRef"
      >
      </v-form-render>
      <el-button
        type="primary"
        @click="submitForm"
        style="width: 80%; margin: 20px 0"
        >发布帖子</el-button
      >
      <a @click="runway" style="cursor: pointer" title="收起">^</a>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import axios from "../hooks/request";
const obj = reactive({
  isShow: false,
  bid: "",
});
const formJson = reactive({
  widgetList: [
    {
      key: 32944,
      type: "grid",
      category: "container",
      icon: "grid",
      cols: [
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              key: 77675,
              type: "input",
              icon: "text-field",
              formItemFlag: true,
              options: {
                name: "input38184",
                label: "请输入标题",
                labelAlign: "",
                type: "text",
                defaultValue: "",
                placeholder: "",
                columnWidth: "200px",
                size: "",
                labelWidth: null,
                labelHidden: false,
                readonly: false,
                disabled: false,
                hidden: false,
                clearable: true,
                showPassword: false,
                required: true,
                requiredHint: "",
                validation: "",
                validationHint: "",
                customClass: "",
                labelIconClass: null,
                labelIconPosition: "rear",
                labelTooltip: null,
                minLength: 1,
                maxLength: 20,
                showWordLimit: true,
                prefixIcon: "",
                suffixIcon: "",
                appendButton: false,
                appendButtonDisabled: false,
                buttonIcon: "custom-search",
                onCreated: "",
                onMounted: "",
                onInput: "",
                onChange: "",
                onFocus: "",
                onBlur: "",
                onValidate: "",
                onAppendButtonClick: "",
              },
              id: "input38184",
            },
          ],
          options: {
            name: "gridCol40109",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: [],
          },
          id: "grid-col-40109",
        },
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              key: 77675,
              type: "input",
              icon: "text-field",
              formItemFlag: true,
              options: {
                name: "input29162",
                label: "请输入标签",
                labelAlign: "",
                type: "text",
                defaultValue: "",
                placeholder: "",
                columnWidth: "200px",
                size: "",
                labelWidth: "",
                labelHidden: false,
                readonly: false,
                disabled: false,
                hidden: false,
                clearable: true,
                showPassword: false,
                required: true,
                requiredHint: "",
                validation: "",
                validationHint: "",
                customClass: [],
                labelIconClass: null,
                labelIconPosition: "rear",
                labelTooltip: null,
                minLength: 1,
                maxLength: 5,
                showWordLimit: true,
                prefixIcon: "",
                suffixIcon: "",
                appendButton: false,
                appendButtonDisabled: false,
                buttonIcon: "custom-search",
                onCreated: "",
                onMounted: "",
                onInput: "",
                onChange: "",
                onFocus: "",
                onBlur: "",
                onValidate: "",
                onAppendButtonClick: "",
              },
              id: "input29162",
            },
          ],
          options: {
            name: "gridCol72032",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: [],
          },
          id: "grid-col-72032",
        },
      ],
      options: {
        name: "grid50583",
        hidden: false,
        gutter: 12,
        colHeight: null,
        customClass: [],
      },
      id: "grid50583",
    },
    {
      key: 56652,
      type: "textarea",
      icon: "textarea-field",
      formItemFlag: true,
      options: {
        name: "textarea111653",
        label: "请输入内容",
        labelAlign: "",
        rows: 3,
        defaultValue: "",
        placeholder: "",
        columnWidth: "200px",
        size: "",
        labelWidth: null,
        labelHidden: false,
        readonly: false,
        disabled: false,
        hidden: false,
        required: true,
        requiredHint: "",
        validation: "",
        validationHint: "",
        customClass: [],
        labelIconClass: null,
        labelIconPosition: "rear",
        labelTooltip: null,
        minLength: 1,
        maxLength: 50,
        showWordLimit: true,
        onCreated: "",
        onMounted: "",
        onInput: "",
        onChange: "",
        onFocus: "",
        onBlur: "",
        onValidate: "",
      },
      id: "textarea111653",
    },
    {
      key: 32944,
      type: "grid",
      category: "container",
      icon: "grid",
      cols: [
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              key: 55755,
              type: "file-upload",
              icon: "file-upload-field",
              formItemFlag: true,
              options: {
                name: "fileupload28013",
                label: "图片",
                labelAlign: "",
                labelWidth: null,
                labelHidden: false,
                columnWidth: "200px",
                disabled: false,
                hidden: false,
                required: false,
                requiredHint: "",
                customRule: "",
                customRuleHint: "",
                uploadURL: "http://localhost:8080/file/uploadFile",
                uploadTip: "",
                withCredentials: false,
                multipleSelect: false,
                showFileList: true,
                limit: 9,
                fileMaxSize: 100,
                fileTypes: ["jpg", "png"],
                customClass: [],
                labelIconClass: null,
                labelIconPosition: "rear",
                labelTooltip: null,
                onCreated: "",
                onMounted: "",
                onBeforeUpload: ``,
                onUploadSuccess:
                  "var video = this.getWidgetRef('fileupload86098')\nvideo.setHidden(true)\n\n",
                onUploadError: "",
                onFileRemove:
                  "const encodedFilePath = encodeURIComponent(file.response.data);axios.delete('http://localhost:8080/file/deleteFile?fileUrl='+encodedFilePath)\nvar video = this.getWidgetRef('fileupload86098');\nif (fileList.length === 0) {\n  video.setHidden(false);\n}",
                onValidate: "",
              },
              id: "fileupload28013",
            },
          ],
          options: {
            name: "gridCol44288",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: [],
          },
          id: "grid-col-44288",
        },
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              key: 33414,
              type: "file-upload",
              icon: "file-upload-field",
              formItemFlag: true,
              options: {
                name: "fileupload86098",
                label: "视频",
                labelAlign: "",
                labelWidth: null,
                labelHidden: false,
                columnWidth: "200px",
                disabled: false,
                hidden: false,
                required: false,
                requiredHint: "",
                customRule: "",
                customRuleHint: "",
                uploadURL: "http://localhost:8080/file/uploadFile",
                uploadTip: "",
                withCredentials: false,
                multipleSelect: false,
                showFileList: true,
                limit: 1,
                fileMaxSize: 1000,
                fileTypes: ["mp4"],
                customClass: "",
                labelIconClass: null,
                labelIconPosition: "rear",
                labelTooltip: null,
                onCreated: "",
                onMounted: "",
                onBeforeUpload: "",
                onUploadSuccess:
                  "var img = this.getWidgetRef('fileupload28013')\nimg.setHidden(true)\n\n",
                onUploadError: "",
                onFileRemove:
                  "const encodedFilePath = encodeURIComponent(file.response.data);axios.delete('http://localhost:8080/file/deleteFile?fileUrl='+encodedFilePath)\nvar img = this.getWidgetRef('fileupload28013')\nif (fileList.length==0) {\n  img.setHidden(false)\n}",
                onValidate: "",
              },

              id: "fileupload86098",
            },
          ],
          options: {
            name: "gridCol57225",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: [],
          },
          id: "grid-col-57225",
        },
      ],
      options: {
        name: "grid26734",
        hidden: false,
        gutter: 12,
        colHeight: null,
        customClass: [],
      },
      id: "grid26734",
    },
  ],
  formConfig: {
    modelName: "formData",
    refName: "vForm",
    rulesName: "rules",
    labelWidth: 80,
    labelPosition: "left",
    size: "",
    labelAlign: "label-left-align",
    cssCode: "",
    customClass: [],
    functions: "",
    layoutType: "PC",
    jsonVersion: 3,
    onFormCreated: "",
    onFormMounted: "",
    onFormDataChange: "",
  },
});
const formData = reactive({});
const optionData = reactive({});
const vFormRef = ref(null);
const submitForm = () => {
  if (!obj.isShow) {
    document.querySelector(".add_blog_box").classList.add("run");
    document.querySelector(".add_blog_box").classList.remove("runway");
    obj.isShow = true;
    axios.get("/blog/createBlog").then((res) => {
      obj.bid = res.data.data;
      console.log(obj.bid);
      let file = vFormRef.value.getWidgetRef("fileupload28013");
      file.setUploadData("bid", obj.bid);
      let video = vFormRef.value.getWidgetRef("fileupload86098");
      video.setUploadData("bid", obj.bid);
    });
  } else {
    vFormRef.value.getFormData().then((formData) => {
      axios
        .post("/blog/addBlog", {
          bid: obj.bid,
          title: formData.input38184,
          tag: formData.input29162,
          content: formData.textarea111653,
        })
        .then((res) => {
          alert("发帖成功");
          window.location.reload();
        });
    });
  }
};
const runway = async () => {
  document.querySelector(".add_blog_box").classList.add("runway");
  document.querySelector(".add_blog_box").classList.remove("run");
  document.querySelector(".tr_Y").style.transform = "translateY(-100px)";
  obj.isShow = false;
};
</script>
<style scoped>
.add_blog_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  position: relative;
  margin: 0 10px 10px 10px;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  position: relative;
  margin-bottom: 10px;
  /* transition: all 0.5s; */
}

.run {
  animation: run 0.5s;
  animation-fill-mode: forwards;
}
.runway {
  animation: runway 0.5s;
  animation-fill-mode: forwards;
}
@keyframes run {
  0% {
    /* transform: translateX(0); */
    height: 10px;
  }
  100% {
    height: 700px;
  }
}
@keyframes runway {
  0% {
    /* transform: translateX(0); */
    height: 700px;
  }
  100% {
    height: 10px;
  }
}
</style>
  