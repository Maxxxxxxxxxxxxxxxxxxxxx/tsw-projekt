<script>
import { twMerge } from "tailwind-merge";

function test() {
  return "test output";
}

export default {
  props: {
    color: String,
  },
  data() {
    return {
      twMerge,
      test,
    };
  },
};
</script>

<template>
  <div
    :class="
      twMerge(
        'border-indigo-800 p-2 rounded flex-auto m-auto text-black',
        'bg-slate-500'
      )
    "
  >
    {{ test() }}
  </div>
</template>
