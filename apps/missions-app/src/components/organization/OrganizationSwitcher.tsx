import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Building2, Plus } from 'lucide-react';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { Database } from '../../lib/supabase';

type Organization = Database['public']['Tables']['organizations']['Row'];

interface OrganizationWithRole extends Organization {
  memberRole: string;
}

interface OrganizationSwitcherProps {
  currentOrgId?: string | null;
  onOrganizationChange?: (organizationId: string) => void;
}

export function OrganizationSwitcher({
  currentOrgId,
  onOrganizationChange,
}: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [currentOrg, setCurrentOrg] = useState<OrganizationWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();

      if (!currentUser) {
        console.warn('No user found');
        return;
      }

      const userOrgs = await supabasePermissionsService.getUserOrganizations(currentUser.id);
      setOrganizations(userOrgs);

      // Set current organization
      if (currentOrgId) {
        const current = userOrgs.find((org) => org.id === currentOrgId);
        setCurrentOrg(current || null);
      } else if (currentUser.organization_id) {
        const current = userOrgs.find((org) => org.id === currentUser.organization_id);
        setCurrentOrg(current || null);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationSelect = async (org: OrganizationWithRole) => {
    setCurrentOrg(org);
    setIsOpen(false);

    // Update user's current organization in profile
    try {
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();
      if (currentUser) {
        await supabasePermissionsService.updateUserProfile(currentUser.id, {
          organization_id: org.id,
        });
      }
    } catch (error) {
      console.error('Error updating current organization:', error);
    }

    // Notify parent component
    if (onOrganizationChange) {
      onOrganizationChange(org.id);
    }

    // Reload page to update context
    window.location.reload();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!currentOrg || organizations.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Organization Icon */}
        {currentOrg.avatar_url ? (
          <img
            src={currentOrg.avatar_url}
            alt={currentOrg.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {currentOrg.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Organization Name */}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
            {currentOrg.name}
          </div>
          <div
            className={`text-xs font-medium px-1.5 py-0.5 rounded inline-block ${getRoleBadgeColor(
              currentOrg.memberRole
            )}`}
          >
            {currentOrg.memberRole}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 max-h-96 overflow-y-auto">
          {/* Organizations List */}
          <div className="px-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              Your Organizations
            </div>
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrganizationSelect(org)}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Organization Icon */}
                {org.avatar_url ? (
                  <img
                    src={org.avatar_url}
                    alt={org.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Organization Info */}
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">{org.name}</div>
                  <div
                    className={`text-xs font-medium px-1.5 py-0.5 rounded inline-block ${getRoleBadgeColor(
                      org.memberRole
                    )}`}
                  >
                    {org.memberRole}
                  </div>
                </div>

                {/* Check Icon */}
                {currentOrg?.id === org.id && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Create New Organization */}
          <div className="px-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Create Organization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
