## 插件使用方法
<loadMore :api="api">
  <template slot-scope="obj">
    <p v-for="item in obj.backdata">
    {{ item.name }}
    </p>
  </template>
</loadMore>
