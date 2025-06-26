import React, { useState } from 'react';

export default function Sample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 파일 유효성 검사
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return '지원되는 이미지 형식: JPEG, PNG, GIF, WebP';
    }
    
    if (file.size > maxSize) {
      return '파일 크기는 5MB 이하여야 합니다';
    }
    
    return null;
  };

  // 이미지 파일 처리
  const handleImageSelect = (files) => {
    const fileArray = Array.from(files);
    const newErrors = {};
    const validFiles = [];
    const newPreviewUrls = [];

    fileArray.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        newErrors[`file_${index}`] = error;
      } else {
        validFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        newPreviewUrls.push(previewUrl);
      }
    });

    if (selectedImages.length + validFiles.length > 5) {
      newErrors.maxFiles = '최대 5개의 이미지만 업로드할 수 있습니다';
      return;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    
    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // 파일 입력 변경 핸들러
  const handleFileInput = (e) => {
    if (e.target.files?.length > 0) {
      handleImageSelect(e.target.files);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length > 0) {
      handleImageSelect(e.dataTransfer.files);
    }
  };

  // 이미지 제거
  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 폼 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
    }
    
    if (selectedImages.length === 0) {
      newErrors.images = '최소 1개의 이미지를 업로드해주세요';
    }
    
    return newErrors;
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors);
    //   return;
    // }

    setIsSubmitting(true);
    
    try {
      // FormData 생성 (실제 서버 전송용)
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        // submitData.append(key, formData[key]);
      });
      
      selectedImages.forEach((file, index) => {
        // submitData.append(`image_${index}`, file);
        submitData.append('image', file);
      });

      for (const x of submitData.entries()) {
        console.log(x);
      };

      // 여기서 실제 서버로 데이터 전송
      // await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션

      const url = "https://dev.wenivops.co.kr/services/mandarin";
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWEzNWQxNTFiYzhhZjhmNjI0NzQ2MiIsImV4cCI6MTc1NTkyNjU3MiwiaWF0IjoxNzUwNzQyNTcyfQ.fIQNjIQLoymvRw6VD8GXHeDvis_7cNvwD26Gqs1z';
      try {
        const response = await fetch(url+"/user/myinfo", {
            method: "GET",
            headers: {
              "Authorization" : `Bearer ${token}`,
              // "Content-type" : "application/json"
            }
            // headers: {
            //   "Content-type" : "application/json"
            // },
            // body: JSON.stringify({
            //   "user": {
            //     "email": "test@test.com",
            //     "password": "1234!@#$"
            //   }
            // })
            // body: JSON.stringify({
            //   "user": {
            //     "username": "테스트",
            //     "email": "test@test.com",
            //     "password": "1234!@#$",
            //     "accountname": "test1",
            //     "intro": "자기소개",
            //     "image": "https://dev.wenivops.co.kr/services/mandarin/1641906557953.png"
            // }})
        });

        const data = await response.json();
        console.log(data.info);
        
        const name = [];
        for(let file in data.info) {
          for(let i of file) {
            name.push(i["filename"]);
          }
        }

        if(name.length > 1) {
          console.log('name', name.join(","));
          return name.join(",");
        } else {
          console.log('name', name[0]);
          return name[0];
        }
      } catch (err) {
        console.error(err);
      }
            
      alert('성공적으로 등록되었습니다!');
      
      // 폼 초기화
      setFormData({ name: '', email: '', phone: '', description: '' });
      setSelectedImages([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setErrors({});
      
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 아이콘 SVG 컴포넌트들
  const UploadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7,10 12,5 17,10"></polyline>
      <line x1="12" y1="5" x2="12" y2="15"></line>
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );

  const ImageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
  );

  const XIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        이미지 등록 폼
      </h2>
      
      <div onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon />
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MailIcon />
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <PhoneIcon />
            전화번호
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="전화번호를 입력하세요"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            설명 (선택사항)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="추가 설명을 입력하세요"
          />
        </div>

        {/* 이미지 업로드 영역 */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <ImageIcon />
            이미지 업로드 (최대 5개)
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : errors.images
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <UploadIcon />
            <p className="text-gray-600 mb-2">
              이미지를 드래그하여 놓거나 클릭하여 선택하세요
            </p>
            <p className="text-sm text-gray-500">
              JPEG, PNG, GIF, WebP (최대 5MB)
            </p>
          </div>
          
          {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
          {Object.keys(errors).filter(key => key.startsWith('file_')).map(key => (
            <p key={key} className="text-red-500 text-xs mt-1">{errors[key]}</p>
          ))}
          {errors.maxFiles && <p className="text-red-500 text-xs mt-1">{errors.maxFiles}</p>}
        </div>

        {/* 이미지 미리보기 */}
        {previewUrls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              선택된 이미지 ({previewUrls.length}/5)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon />
                  </button>
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {selectedImages[index]?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
          } text-white`}
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
}