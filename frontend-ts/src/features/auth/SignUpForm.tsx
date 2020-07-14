import React, { FC, useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { MdNavigateNext } from 'react-icons/md';
import Button from 'components/Button';

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

enum FormStep {
  Username,
  Account,
};

const validation = {
  username: {
    required: 'Please pick a username',
    maxLength: {value: 20, message: 'A username cannot be longer than 20 characters'},
  },
  email: {
    required: 'Please enter your email',
    maxLength: {value: 64, message: 'An email cannot be longer than 64 characters'},
  },
  password: {
    required: 'Please enter a password',
  },
  confirm_password: {
    required: 'Please confirm your password',
  },
};

const SignUpForm: FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const emailInput = useRef<HTMLInputElement | null>(null);
  const [formStep, setFormStep] = useState<FormStep>(FormStep.Username);
  const { register, trigger, handleSubmit, errors } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (formStep === FormStep.Account) {
      emailInput.current?.focus();
    }
  }, [formStep]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={form}>
      {/* Username */}
      <div className={`${(formStep === FormStep.Username) ? '' : 'hidden'}`}>
        <div className="relative">
          <input 
            type="text"
            name="username"
            placeholder="Choose your Username"
            ref={el => {
              el?.focus();
              register(el, validation.username);
            }}
            className={`w-full rounded-full bg-gray-100 px-6 py-3 text-lg border-2 ${errors.username && 'border-red-600'}`} />
          <Button 
            className="absolute top-0 right-0 mr-1.5 mt-1.5 text-gray-100"
            type="primary"
            onClick={async () => {
              const result = await trigger("username");
              if (result) { setFormStep(FormStep.Account); }
            }}>
            <MdNavigateNext size="1.5rem" />
          </Button>
        </div>
        <ErrorMessage className="px-6 text-red-600" errors={errors} name="username" as="p" />
      </div>

      {/* Account Details */}
      <div className={`${(formStep === FormStep.Account) ? '' : 'hidden'}`}>
        <div className="pb-4">
          <input 
            type="text"
            name="email"
            placeholder="mary.sue@example.com"
            ref={el => {
              register(el, validation.email);
              emailInput.current = el;
            }}
            className={`w-full rounded-full bg-gray-100 px-6 py-3 text-lg ${errors.email && 'border-red-600'}`} />
          <ErrorMessage className="px-6 text-red-600" errors={errors} name="email" as="p" />
        </div>
        <div className="pb-4">
          <input 
            type="password"
            name="password"
            placeholder="Set your password"
            ref={register(validation.password)}
            className={`w-full rounded-full bg-gray-100 px-6 py-3 text-lg ${errors.password && 'border-red-600'}`} />
          <ErrorMessage className="px-6 text-red-600" errors={errors} name="password" as="p" />
        </div>
        <div className="pb-4">
          <input 
            type="password"
            name="confirm_password"
            placeholder="Confirm password"
            ref={register(validation.confirm_password)}
            className={`w-full rounded-full bg-gray-100 px-6 py-3 text-lg ${errors.confirm_password && 'border-red-600'}`} />
          <ErrorMessage className="px-6 text-red-600" errors={errors} name="confirm_password" as="p" />
        </div>
        <input type="submit" className="block rounded-full border-2 px-6 py-3 text-lg font-semibold bg-blue-600 text-blue-100 border-blue-600 hover:border-blue-500 hover:bg-blue-500 focus:border-blue-500 focus:bg-blue-500" />
      </div>
    </form>
  );
};

export default SignUpForm;
