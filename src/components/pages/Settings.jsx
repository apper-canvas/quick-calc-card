import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      organizationName: "SkyOps Aviation",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      language: "English"
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      shiftReminders: true,
      eventReminderTime: 24,
      shiftReminderTime: 2
    },
    calendar: {
      defaultView: "month",
      workingHours: {
        start: "08:00",
        end: "18:00"
      },
      weekends: true,
      holidays: true
    },
    security: {
      sessionTimeout: 60,
      twoFactorAuth: false,
      passwordExpiry: 90,
      loginAttempts: 3
    }
  });

  const tabs = [
    { id: "general", name: "General", icon: "Settings" },
    { id: "notifications", name: "Notifications", icon: "Bell" },
    { id: "calendar", name: "Calendar", icon: "Calendar" },
    { id: "security", name: "Security", icon: "Shield" }
  ];

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      // Reset logic would go here
      toast.info("Settings reset to defaults");
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (category, parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parent]: {
          ...prev[category][parent],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Settings</h1>
          <p className="text-slate-600 mt-2">Configure your SkyOps application preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleReset} variant="ghost">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Settings" className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-slate-800">General Settings</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Organization Name"
                    value={settings.general.organizationName}
                    onChange={(e) => updateSetting("general", "organizationName", e.target.value)}
                  />

                  <Select
                    label="Timezone"
                    value={settings.general.timezone}
                    onChange={(e) => updateSetting("general", "timezone", e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Select
                    label="Date Format"
                    value={settings.general.dateFormat}
                    onChange={(e) => updateSetting("general", "dateFormat", e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>

                  <Select
                    label="Time Format"
                    value={settings.general.timeFormat}
                    onChange={(e) => updateSetting("general", "timeFormat", e.target.value)}
                  >
                    <option value="12h">12 Hour</option>
                    <option value="24h">24 Hour</option>
                  </Select>

                  <Select
                    label="Language"
                    value={settings.general.language}
                    onChange={(e) => updateSetting("general", "language", e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                  </Select>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Bell" className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Notification Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">Email Notifications</div>
                          <div className="text-sm text-slate-600">Receive notifications via email</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => updateSetting("notifications", "emailNotifications", e.target.checked)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">SMS Notifications</div>
                          <div className="text-sm text-slate-600">Receive notifications via SMS</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => updateSetting("notifications", "smsNotifications", e.target.checked)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">Event Reminders</div>
                          <div className="text-sm text-slate-600">Remind about upcoming events</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.eventReminders}
                          onChange={(e) => updateSetting("notifications", "eventReminders", e.target.checked)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">Shift Reminders</div>
                          <div className="text-sm text-slate-600">Remind about upcoming shifts</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.shiftReminders}
                          onChange={(e) => updateSetting("notifications", "shiftReminders", e.target.checked)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Reminder Time (hours before)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={settings.notifications.eventReminderTime}
                        onChange={(e) => updateSetting("notifications", "eventReminderTime", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Shift Reminder Time (hours before)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={settings.notifications.shiftReminderTime}
                        onChange={(e) => updateSetting("notifications", "shiftReminderTime", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Settings */}
            {activeTab === "calendar" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Calendar Settings</h2>
                </div>

                <div className="space-y-6">
                  <Select
                    label="Default Calendar View"
                    value={settings.calendar.defaultView}
                    onChange={(e) => updateSetting("calendar", "defaultView", e.target.value)}
                  >
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                  </Select>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Working Hours</label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={settings.calendar.workingHours.start}
                          onChange={(e) => updateNestedSetting("calendar", "workingHours", "start", e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">End Time</label>
                        <input
                          type="time"
                          value={settings.calendar.workingHours.end}
                          onChange={(e) => updateNestedSetting("calendar", "workingHours", "end", e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">Show Weekends</div>
                        <div className="text-sm text-slate-600">Display weekends in calendar</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.calendar.weekends}
                        onChange={(e) => updateSetting("calendar", "weekends", e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">Show Holidays</div>
                        <div className="text-sm text-slate-600">Display public holidays</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.calendar.holidays}
                        onChange={(e) => updateSetting("calendar", "holidays", e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ApperIcon name="Shield" className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={settings.security.loginAttempts}
                        onChange={(e) => updateSetting("security", "loginAttempts", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting("security", "passwordExpiry", parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 md:max-w-xs"
                    />
                  </div>

                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-600">Enable 2FA for additional security</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.security.twoFactorAuth && (
                        <Badge variant="success" size="sm">Enabled</Badge>
                      )}
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => updateSetting("security", "twoFactorAuth", e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save/Reset Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-slate-600">
            <ApperIcon name="Info" className="w-4 h-4 inline mr-2" />
            Changes will be applied immediately and affect all users.
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleReset} variant="ghost">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} variant="primary">
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;