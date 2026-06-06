import React, { useState, useEffect } from 'react';

export default function DynamicForm({
  title,
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  error = '',
}) {
  const [values, setValues] = useState({});

  useEffect(() => {
    const defaultValues = {};
    fields.forEach((field) => {
      // Set value to initial value, checkbox default is false, others empty string or null
      if (initialValues[field.name] !== undefined) {
        defaultValues[field.name] = initialValues[field.name];
      } else if (field.type === 'checkbox') {
        defaultValues[field.name] = false;
      } else {
        defaultValues[field.name] = '';
      }
    });
    setValues(defaultValues);
  }, [JSON.stringify(fields), JSON.stringify(initialValues)]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      {title && (
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-rose-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {fields.map((field) => {
            const isFullWidth = field.fullWidth !== false;
            const gridClass = isFullWidth ? 'sm:col-span-6' : 'sm:col-span-3';

            return (
              <div key={field.name} className={gridClass}>
                {field.type === 'checkbox' ? (
                  <div className="flex items-start mt-2">
                    <div className="flex items-center h-5">
                      <input
                        id={field.name}
                        name={field.name}
                        type="checkbox"
                        checked={!!values[field.name]}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={field.name} className="font-medium text-slate-300 cursor-pointer">
                        {field.label}
                      </label>
                      {field.description && (
                        <p className="text-slate-500 text-xs mt-0.5">{field.description}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <label htmlFor={field.name} className="block text-sm font-medium text-slate-300">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="mt-1">
                      {field.type === 'select' ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={values[field.name] ?? ''}
                          onChange={handleChange}
                          required={field.required}
                          disabled={loading}
                          className="block w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type || 'text'}
                          value={values[field.name] ?? ''}
                          onChange={handleChange}
                          required={field.required}
                          placeholder={field.placeholder}
                          disabled={loading}
                          className="block w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 transition-all duration-200"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-8">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
