<template>
  <div class="kb-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 class="fw-bold mb-0" style="color:var(--kb-dark);">
        <i class="bi bi-tags-fill me-2" style="color:var(--kb-orange);"></i>카테고리 관리
      </h5>
      <!-- 탭 -->
      <div class="d-flex gap-2">
        <button
          v-for="t in ['expense','income']"
          :key="t"
          class="kb-tab-btn"
          :class="{ active: activeTab === t }"
          @click="activeTab = t"
        >
          {{ t === 'expense' ? '지출' : '수입' }}
        </button>
      </div>
    </div>

    <!-- 카테고리 칩 목록 -->
    <div class="d-flex flex-wrap gap-2 mb-4 min-chips">
      <TransitionGroup name="chip">
        <div
          v-for="cat in store.categories[activeTab]"
          :key="cat"
          class="kb-chip"
          :class="{ 'kb-chip-income': activeTab === 'income' }"
        >
          <span>{{ cat }}</span>
          <button class="kb-chip-del" @click="removeCategory(cat)" title="삭제">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </TransitionGroup>
      <div v-if="store.categories[activeTab].length === 0" class="text-muted" style="font-size:0.85rem;">
        카테고리가 없습니다.
      </div>
    </div>

    <!-- 추가 인풋 -->
    <div class="d-flex gap-2">
      <input
        v-model="newCatName"
        type="text"
        class="form-control kb-input"
        :placeholder="activeTab === 'expense' ? '새 지출 카테고리' : '새 수입 카테고리'"
        @keyup.enter="addCategory"
        maxlength="12"
      />
      <button class="btn btn-kb-primary px-4" @click="addCategory" :disabled="!newCatName.trim()">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
    <div v-if="errorMsg" class="text-danger mt-2" style="font-size:0.82rem;">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHouseholdStore } from '@/stores/household.js'

const store = useHouseholdStore()
const activeTab = ref('expense')
const newCatName = ref('')
const errorMsg = ref('')

const addCategory = () => {
  const name = newCatName.value.trim()
  errorMsg.value = ''
  if (!name) return
  if (store.categories[activeTab.value].includes(name)) {
    errorMsg.value = '이미 존재하는 카테고리입니다.'
    return
  }
  store.addCategory(activeTab.value, name)
  newCatName.value = ''
}

const removeCategory = (name) => {
  store.removeCategory(activeTab.value, name)
}
</script>

<style scoped>
.kb-tab-btn {
  border: 2px solid #e8e8e8;
  background: #f8f8f8;
  color: #999;
  border-radius: 20px;
  padding: 0.3rem 1rem;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}
.kb-tab-btn.active {
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-color: var(--kb-orange);
  color: white;
}

.kb-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--kb-orange-light);
  color: var(--kb-orange-deeper);
  border: 1.5px solid rgba(245,166,35,0.25);
  border-radius: 20px;
  padding: 0.3rem 0.75rem 0.3rem 0.85rem;
  font-size: 0.84rem;
  font-weight: 600;
}
.kb-chip-income {
  background: #e8f8ef;
  color: #1a7a3a;
  border-color: rgba(40,167,69,0.25);
}
.kb-chip-del {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  line-height: 1;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}
.kb-chip-del:hover { opacity: 1; }

.min-chips { min-height: 44px; }

/* 칩 트랜지션 */
.chip-enter-active, .chip-leave-active { transition: all 0.25s ease; }
.chip-enter-from { opacity: 0; transform: scale(0.7); }
.chip-leave-to   { opacity: 0; transform: scale(0.7); }
</style>
