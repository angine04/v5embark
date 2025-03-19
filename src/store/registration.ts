import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RegistrationForm {
  // 初始信息
  studentId: string
  name: string
  
  // 基本信息
  year: string
  gender: 'male' | 'female'
  college: string
  major: string
  techGroup: 'software' | 'hardware' | 'mechanical'
  
  // 联系方式
  phone: string
  email: string
  qq: string
  wechat: string
  
  // 个人信息
  idCard: string
  birthday: string
  hometown: string
  currentResidence: string
  ethnicity: string
  dietaryRestrictions: string
  highSchool: string
  
  // 账号信息
  username: string
  password: string
  
  // 系统信息
  joinDate: string
}

// 初始信息
interface InitialFormData {
  studentId: string
  name: string
}

// 基本信息
interface BasicInfoData {
  year: string
  gender: 'male' | 'female'
  college: string
  major: string
  techGroup: 'software' | 'hardware' | 'mechanical'
}

// 联系方式
interface ContactData {
  phone: string
  email: string
  qq: string
}

// 个人信息
interface PersonalInfoData {
  idCard: string
  birthday: string
  hometown: string
  currentResidence: string
  ethnicity: string
  dietaryRestrictions: string
  highSchool: string
}

// 账号信息
interface AccountData {
  username: string
  password: string
}

interface InitialFormStore {
  formData: InitialFormData
  setFormData: (data: InitialFormData) => void
  resetForm: () => void
}

interface BasicInfoStore {
  formData: BasicInfoData
  setFormData: (data: BasicInfoData) => void
  resetForm: () => void
}

interface ContactStore {
  formData: ContactData
  setFormData: (data: ContactData) => void
  resetForm: () => void
}

interface PersonalInfoStore {
  formData: PersonalInfoData
  setFormData: (data: PersonalInfoData) => void
  resetForm: () => void
}

interface AccountStore {
  formData: AccountData
  setFormData: (data: AccountData) => void
  resetForm: () => void
}

// 全局状态
interface GlobalStore {
  currentStep: number
  setCurrentStep: (step: number) => void
  resetAllForms: () => void
}

// 创建独立的 store
export const useInitialFormStore = create<InitialFormStore>()(
  persist(
    (set) => ({
      formData: {
        studentId: '',
        name: '',
      },
      setFormData: (data) => set({ formData: data }),
      resetForm: () => set({ formData: { studentId: '', name: '' } }),
    }),
    {
      name: 'registration-initial',
    }
  )
)

export const useBasicInfoStore = create<BasicInfoStore>()(
  persist(
    (set) => ({
      formData: {
        year: '',
        gender: 'male',
        college: '',
        major: '',
        techGroup: 'software',
      },
      setFormData: (data) => set({ formData: data }),
      resetForm: () => set({
        formData: {
          year: '',
          gender: 'male',
          college: '',
          major: '',
          techGroup: 'software',
        }
      }),
    }),
    {
      name: 'registration-basic',
    }
  )
)

export const useContactStore = create<ContactStore>()(
  persist(
    (set) => ({
      formData: {
        phone: '',
        email: '',
        qq: '',
      },
      setFormData: (data) => set({ formData: data }),
      resetForm: () => set({
        formData: {
          phone: '',
          email: '',
          qq: '',
        }
      }),
    }),
    {
      name: 'registration-contact',
    }
  )
)

export const usePersonalInfoStore = create<PersonalInfoStore>()(
  persist(
    (set) => ({
      formData: {
        idCard: '',
        birthday: '',
        hometown: '',
        currentResidence: '',
        ethnicity: '',
        dietaryRestrictions: '',
        highSchool: '',
      },
      setFormData: (data) => set({ formData: data }),
      resetForm: () => set({
        formData: {
          idCard: '',
          birthday: '',
          hometown: '',
          currentResidence: '',
          ethnicity: '',
          dietaryRestrictions: '',
          highSchool: '',
        }
      }),
    }),
    {
      name: 'registration-personal',
    }
  )
)

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      formData: {
        username: '',
        password: '',
      },
      setFormData: (data) => set({ formData: data }),
      resetForm: () => set({
        formData: {
          username: '',
          password: '',
        }
      }),
    }),
    {
      name: 'registration-account',
    }
  )
)

// 全局状态 store
export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      resetAllForms: () => {
        useInitialFormStore.getState().resetForm()
        useBasicInfoStore.getState().resetForm()
        useContactStore.getState().resetForm()
        usePersonalInfoStore.getState().resetForm()
        useAccountStore.getState().resetForm()
        set({ currentStep: 0 })
      },
    }),
    {
      name: 'registration-global',
    }
  )
) 