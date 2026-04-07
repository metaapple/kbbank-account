<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="txModal" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content kb-modal">
        <!-- Header -->
        <div class="modal-header kb-modal-header border-0 pb-0">
          <div class="d-flex gap-2">
            <button
              class="kb-type-btn"
              :class="{ active: form.type === 'expense' }"
              @click="form.type = 'expense'"
            >
              <i class="bi bi-arrow-down-circle me-1"></i>지출
            </button>
            <button
              class="kb-type-btn income"
              :class="{ active: form.type === 'income' }"
              @click="form.type = 'income'"
            >
              <i class="bi bi-arrow-up-circle me-1"></i>수입
            </button>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- Body -->
        <div class="modal-body pt-2">
          <!-- 금액 (강조) -->
          <div class="kb-amount-wrap mb-4">
            <label class="form-label text-muted" style="font-size:0.82rem;">금액</label>
            <div class="input-group">
              <input
                v-model="amountDisplay"
                type="text"
                inputmode="numeric"
                class="form-control kb-input kb-amount-input"
                :class="{ 'is-invalid': submitted && !form.amount }"
                placeholder="0"
                @input="onAmountInput"
              />
              <span class="input-group-text kb-input-addon">원</span>
            </div>
            <div v-if="submitted && !form.amount" class="text-danger mt-1" style="font-size:0.8rem;">금액을 입력하세요.</div>
          </div>

          <div class="row g-3">
            <!-- 내용 -->
            <div class="col-12">
              <label class="form-label fw-semibold" style="font-size:0.85rem;color:var(--kb-dark);">내용</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control kb-input"
                :class="{ 'is-invalid': submitted && !form.name }"
                placeholder="내용을 입력하세요"
              />
              <div v-if="submitted && !form.name" class="invalid-feedback">내용을 입력하세요.</div>
            </div>

            <!-- 카테고리 -->
            <div class="col-6">
              <label class="form-label fw-semibold" style="font-size:0.85rem;color:var(--kb-dark);">카테고리</label>
              <select
                v-model="form.category"
                class="form-select kb-input"
                :class="{ 'is-invalid': submitted && !form.category }"
              >
                <option value="" disabled>선택</option>
                <option v-for="c in store.categories[form.type]" :key="c">{{ c }}</option>
              </select>
              <div v-if="submitted && !form.category" class="invalid-feedback">카테고리를 선택하세요.</div>
            </div>

            <!-- 날짜 -->
            <div class="col-6">
              <label class="form-label fw-semibold" style="font-size:0.85rem;color:var(--kb-dark);">날짜</label>
              <input
                v-model="form.date"
                type="date"
                class="form-control kb-input"
                :class="{ 'is-invalid': submitted && !form.date }"
              />
              <div v-if="submitted && !form.date" class="invalid-feedback">날짜를 선택하세요.</div>
            </div>

            <!-- 메모 -->
            <div class="col-12">
              <label class="form-label fw-semibold" style="font-size:0.85rem;color:var(--kb-dark);">메모 <span class="text-muted fw-normal">(선택)</span></label>
              <input
                v-model="form.memo"
                type="text"
                class="form-control kb-input"
                placeholder="메모를 입력하세요"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-kb-outline flex-1" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-kb-primary flex-1" @click="handleSubmit">
            <i class="bi bi-plus-circle me-1"></i>추가하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useHouseholdStore } from '@/stores/household.js'

const store = useHouseholdStore()
const modalEl = ref(null)
const submitted = ref(false)

const today = () => new Date().toISOString().split('T')[0]

const form = reactive({
  type: 'expense',
  name: '',
  amount: 0,
  category: '',
  date: today(),
  memo: ''
})

const amountDisplay = ref('')

const onAmountInput = (e) => {
  const raw = e.target.value.replace(/[^0-9]/g, '')
  form.amount = parseInt(raw) || 0
  amountDisplay.value = raw ? parseInt(raw).toLocaleString() : ''
}

// 타입 변경 시 카테고리 초기화
watch(() => form.type, () => { form.category = '' })

const resetForm = () => {
  form.type = 'expense'
  form.name = ''
  form.amount = 0
  form.category = ''
  form.date = today()
  form.memo = ''
  amountDisplay.value = ''
  submitted.value = false
}

const handleSubmit = () => {
  submitted.value = true
  if (!form.amount || !form.name || !form.category || !form.date) return

  store.addTransaction({ ...form })

  // 모달 닫기
  const { Modal } = window.bootstrap
  const m = Modal.getInstance(modalEl.value) || new Modal(modalEl.value)
  m.hide()
  resetForm()
}

// 모달 열릴 때 폼 리셋
const open = () => {
  resetForm()
  const { Modal } = window.bootstrap
  const m = Modal.getOrCreateInstance(modalEl.value)
  m.show()
}

defineExpose({ open })
</script>

<style scoped>
.kb-modal {
  border-radius: 24px;
  border: none;
  overflow: hidden;
}

.kb-modal-header {
  padding: 1.5rem 1.5rem 0.75rem;
}

.kb-type-btn {
  border: 2px solid #e8e8e8;
  background: #f8f8f8;
  color: #999;
  border-radius: 20px;
  padding: 0.4rem 1.1rem;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s;
  cursor: pointer;
}
.kb-type-btn.active {
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-color: var(--kb-orange);
  color: white;
  box-shadow: 0 4px 12px rgba(245,166,35,0.4);
}
.kb-type-btn.income.active {
  background: linear-gradient(135deg, #28a745, #20c997);
  border-color: #28a745;
  box-shadow: 0 4px 12px rgba(40,167,69,0.35);
}

.kb-amount-input {
  font-size: 1.6rem !important;
  font-weight: 700 !important;
  border-right: none !important;
  color: var(--kb-dark);
}
.kb-input-addon {
  background: #fafafa;
  border: 2px solid #e8e8e8;
  border-left: none;
  border-radius: 0 12px 12px 0 !important;
  font-weight: 600;
  color: var(--kb-gray);
}

.flex-1 { flex: 1; }
</style>
