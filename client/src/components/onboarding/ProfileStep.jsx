import TextInput from '../ui/TextInput'

/**
 * Displays the profile form that collects the user's name, username, and email.
 */
function ProfileStep({
    values,
    errors,
    onChange
}) {
    return (
        <section aria-labelledby='profile-heading'>
            <p className='mb-4 text-xs font-bold tracking-[0.2em] text-momentum-lime'>
                LET&apos;S GET STARTED
            </p>

            <h1
                id='profile-heading'
                className='font-display m-0 text-4xl leading-[1.08] text-[#f5f5f7] sm:text-5xl'>
                    Tell us about yourself
            </h1>

            <p className='mt-4 text-base font-medium text-momentum-muted'>
                We&apos;ll use this information to personalize your Momentum experience.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2'>
                <TextInput
                    id='firstName'
                    label='First Name'
                    value={values.firstName}
                    error={errors.firstName}
                    autoComplete="given-name"
                    maxLength={50}
                    placeholder='John'
                    onChange={onChange}
                />

                <TextInput
                    id='lastName'
                    label='Last Name'
                    value={values.lastName}
                    error={errors.lastName}
                    autoComplete="family-name"
                    maxLength={50}
                    placeholder='Doe'
                    onChange={onChange}
                />

                <div className='sm:col-span-2'>
                    <TextInput
                    id="username"
                    label="Username"
                    value={values.username}
                    error={errors.username}
                    autoComplete="username"
                    maxLength={50}
                    placeholder="johndoe"
                    onChange={onChange}
                    />
                </div>

                <div className='sm:col-span-2'>
                    <TextInput
                    id="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    error={errors.email}
                    autoComplete="email"
                    maxLength={100}
                    placeholder="johndoe@example.com"
                    onChange={onChange}
                    />
                </div>
            </div>
        </section>
    )
}

export default ProfileStep
