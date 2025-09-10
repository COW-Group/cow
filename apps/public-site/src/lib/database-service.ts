"use client"

import { supabase } from "./supabase"
import type { 
  UserProfile, 
  TokenOffering, 
  InvestmentHolding, 
  Company, 
  TradeOrder, 
  KYCData, 
  AccreditationData,
  Goal,
  Team
} from "./types"

export interface DatabaseService {
  // User Profile Management
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>
  createOrUpdateUserProfile: (userId: string, name: string, role?: string) => Promise<UserProfile>
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<UserProfile>
  
  // Token Offerings
  fetchTokenOfferings: (status?: string) => Promise<TokenOffering[]>
  fetchTokenOffering: (id: string) => Promise<TokenOffering | null>
  
  // Investment Holdings
  fetchUserHoldings: (userId: string) => Promise<InvestmentHolding[]>
  fetchUserHolding: (userId: string, tokenOfferingId: string) => Promise<InvestmentHolding | null>
  updateHolding: (holdingId: string, updates: Partial<InvestmentHolding>) => Promise<InvestmentHolding>
  
  // Companies
  fetchCompanies: () => Promise<Company[]>
  fetchCompany: (id: string) => Promise<Company | null>
  
  // Trading
  createTradeOrder: (order: Omit<TradeOrder, 'id' | 'submittedAt'>) => Promise<TradeOrder>
  fetchUserTradeOrders: (userId: string) => Promise<TradeOrder[]>
  updateTradeOrder: (orderId: string, updates: Partial<TradeOrder>) => Promise<TradeOrder>
  
  // Compliance
  fetchUserKYC: (userId: string) => Promise<KYCData | null>
  updateKYCStatus: (userId: string, status: string, notes?: string) => Promise<KYCData>
  fetchUserAccreditation: (userId: string) => Promise<AccreditationData | null>
  updateAccreditationStatus: (userId: string, status: string) => Promise<AccreditationData>
  
  // Goals (from existing system)
  fetchUserGoals: (userId: string) => Promise<Goal[]>
  createGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<Goal>
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<Goal>
  deleteGoal: (goalId: string) => Promise<void>
  
  // Teams
  fetchTeams: (companyId?: string) => Promise<Team[]>
}

export const databaseService: DatabaseService = {
  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  },

  async createOrUpdateUserProfile(userId: string, name: string, role: string = 'investor'): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          name,
          role,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      throw error
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  async fetchTokenOfferings(status?: string): Promise<TokenOffering[]> {
    try {
      let query = supabase
        .from('token_offerings')
        .select(`
          *,
          companies (
            id,
            name,
            description,
            industry,
            logo
          )
        `)
        .order('launch_date', { ascending: false })
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching token offerings:', error)
      return []
    }
  },

  async fetchTokenOffering(id: string): Promise<TokenOffering | null> {
    try {
      const { data, error } = await supabase
        .from('token_offerings')
        .select(`
          *,
          companies (
            id,
            name,
            description,
            industry,
            website,
            logo,
            founded_year,
            headquarters
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching token offering:', error)
      return null
    }
  },

  async fetchUserHoldings(userId: string): Promise<InvestmentHolding[]> {
    try {
      const { data, error } = await supabase
        .from('investment_holdings')
        .select(`
          *,
          token_offerings (
            id,
            name,
            symbol,
            token_type,
            price_per_token
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('purchase_date', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user holdings:', error)
      return []
    }
  },

  async fetchUserHolding(userId: string, tokenOfferingId: string): Promise<InvestmentHolding | null> {
    try {
      const { data, error } = await supabase
        .from('investment_holdings')
        .select('*')
        .eq('user_id', userId)
        .eq('token_offering_id', tokenOfferingId)
        .eq('status', 'active')
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user holding:', error)
      return null
    }
  },

  async updateHolding(holdingId: string, updates: Partial<InvestmentHolding>): Promise<InvestmentHolding> {
    try {
      const { data, error } = await supabase
        .from('investment_holdings')
        .update({
          ...updates,
          last_updated: new Date().toISOString()
        })
        .eq('id', holdingId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating holding:', error)
      throw error
    }
  },

  async fetchCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          token_offerings (
            id,
            name,
            symbol,
            status,
            price_per_token,
            target_amount,
            raised_amount
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching companies:', error)
      return []
    }
  },

  async fetchCompany(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          token_offerings (*),
          company_documents (*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching company:', error)
      return null
    }
  },

  async createTradeOrder(order: Omit<TradeOrder, 'id' | 'submittedAt'>): Promise<TradeOrder> {
    try {
      const { data, error } = await supabase
        .from('trade_orders')
        .insert({
          ...order,
          submitted_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating trade order:', error)
      throw error
    }
  },

  async fetchUserTradeOrders(userId: string): Promise<TradeOrder[]> {
    try {
      const { data, error } = await supabase
        .from('trade_orders')
        .select(`
          *,
          token_offerings (
            name,
            symbol,
            price_per_token
          )
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching trade orders:', error)
      return []
    }
  },

  async updateTradeOrder(orderId: string, updates: Partial<TradeOrder>): Promise<TradeOrder> {
    try {
      const { data, error } = await supabase
        .from('trade_orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating trade order:', error)
      throw error
    }
  },

  async fetchUserKYC(userId: string): Promise<KYCData | null> {
    try {
      const { data, error } = await supabase
        .from('kyc_data')
        .select(`
          *,
          kyc_documents (*)
        `)
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching KYC data:', error)
      return null
    }
  },

  async updateKYCStatus(userId: string, status: string, notes?: string): Promise<KYCData> {
    try {
      const { data, error } = await supabase
        .from('kyc_data')
        .upsert({
          user_id: userId,
          status,
          notes,
          reviewed_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating KYC status:', error)
      throw error
    }
  },

  async fetchUserAccreditation(userId: string): Promise<AccreditationData | null> {
    try {
      const { data, error } = await supabase
        .from('accreditation_data')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching accreditation data:', error)
      return null
    }
  },

  async updateAccreditationStatus(userId: string, status: string): Promise<AccreditationData> {
    try {
      const { data, error } = await supabase
        .from('accreditation_data')
        .update({ 
          status,
          verified_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating accreditation status:', error)
      throw error
    }
  },

  async fetchUserGoals(userId: string): Promise<Goal[]> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching goals:', error)
      return []
    }
  },

  async createGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          createdAt: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  },

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  },

  async fetchTeams(companyId?: string): Promise<Team[]> {
    try {
      let query = supabase
        .from('teams')
        .select('*')
        .order('createdAt', { ascending: false })
      
      if (companyId) {
        query = query.eq('companyId', companyId)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }
}