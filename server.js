const express = require('express');
  users[user] = {password:pass, pro:false, role:"user"};
  chats[user] = {};

  res.json({ok:true});
});

app.post('/login', (req,res)=>{
  const {user,pass} = req.body;

  if(users[user] && users[user].password === pass){
    const token = Math.random().toString(36).substr(2);
    sessions[token] = user;
    return res.json({token});
  }

  res.json({error:"Invalid login"});
});

function auth(req){
  const token = req.headers.token;
  return sessions[token];
}

// ======================= CHAT =======================
app.post('/chat', (req,res)=>{
  const user = auth(req);
  if(!user) return res.json({error:"No auth"});

  const {msg,chatId} = req.body;

  if(!chats[user][chatId]) chats[user][chatId] = [];

  const reply = aiResponse(msg, users[user].pro);

  chats[user][chatId].push({msg,reply});

  res.json({reply});
});

// ======================= PRO UPGRADE (SIMULATED) =======================
app.post('/upgrade', (req,res)=>{
  const user = auth(req);
  if(!user) return res.json({error:"No auth"});

  users[user].pro = true;
  res.json({ok:true, message:"Pro enabled"});
});

// ======================= ADMIN =======================
app.post('/admin/users', (req,res)=>{
  const user = auth(req);
  if(user !== "owner") return res.json({error:"Denied"});

  res.json(users);
});

// ======================= START SERVER =======================
app.listen(PORT, ()=>{
  console.log("RedAI running on http://localhost:"+PORT);
});
