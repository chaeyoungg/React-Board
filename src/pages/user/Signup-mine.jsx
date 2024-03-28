import useCustomAxios from "@hooks/useCustomAxios.mjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const errorStyle = {
  fontSize: '12px',
  color: 'red',
  fontWeight: 'bold'
};

//{{url}}/users/email?email=u1%40market.com

function Signup() {
  const [EmailError, setEmailError] = useState(false);
  const axios = useCustomAxios();
  const {register, handleSubmit, formState : { errors }} = useForm({
    // values : {
    //   email: 'u1@market.com',
    //   password: '11111111',
    //   type: 'user',
    //   name: 'test111'
    // }
  }
    
  );
  const navigate = useNavigate();



  const onSubmit = async formData =>{
    try{
      confirmEmail(formData);
      const res = await axios.post('/users', formData);
      console.log(res);
      alert('회원가입이 완료 되었습니다 :) ');
      navigate('/users/login');
    }
    catch(err){
      alert('회원가입을 다시 시도해주세요.');
      console.log(err);
    }
  };

  const confirmEmail = async formData => {
    const email = formData.email.replace('@', '%40');
    try{
      await axios.get(`/users/email?email=${email}`);
    }
    catch(err){
      setEmailError(true);
    }
  };
  


  return (
    <div>
       <h2>회원 가입</h2>

       <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">이메일</label>
        <input type="text" id="email" {...register('email', {
          required: '이메일을 입력하세요.',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '이메일 형식이 아닙니다.'
          }}
        )} />
        <br />
        { errors && <div style={ errorStyle }>{ errors.email?.message }</div> }
        { EmailError && (<div style={errorStyle}>이미 사용중인 이메일입니다. </div>)}

        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" {...register('password', {
          required: '비밀번호를 입력하세요.',
          minLength : 8 
        })} /><br />
        { errors && <div style={ errorStyle }>{ errors.password?.message }</div> }

        <label htmlFor="name">이름</label>
        <input type="text" id="name" {...register('name', {
          required: '이름을 입력하세요.'
        })} /><br />
        { errors && <div style={ errorStyle }>{ errors.name?.message }</div> }
        
        <label><input type="radio" name="type" value="seller" {...register('type', {
          required: '회원 타입을 선택하세요.'
        })}/>판매자</label>
        <label><input type="radio" name="type" value="user" {...register('type', {
          required: '회원 타입을 선택하세요.'
        })}/>고객</label>
        { errors && <div style={ errorStyle }>{ errors.type?.message }</div> }

        <br />
       <button type="submit">가입하기</button>
       </form>
    </div>
  )
}

export default Signup;