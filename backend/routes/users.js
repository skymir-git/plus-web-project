var express = require("express");
var router = express.Router();

// mysql 선언
var dbConObj = require("../lib/db_config");
var conn = dbConObj.init();

var bcrypt = require("bcrypt-nodejs");

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

//회원 가입
router.post("/signUp", function (req, res) {
  const user = {
    userid: req.body.user.userid,
    name: req.body.user.name,
    password: req.body.user.password,
  };

  const salt = bcrypt.genSaltSync();
  const encryptedPassword = bcrypt.hashSync(user.password, salt);

  conn.query(
    "INSERT INTO capdi_users (userid,name,password) VALUES (?,?,?)",
    [user.userid, user.name, encryptedPassword],
    function (err, row) {
      if (err) throw err;
    }
  );

  res.json({
    success: true,
    message: "회원 가입이 완료되었습니다!",
  });
});

//아이디 체크
router.post("/idCheck", function (req, res) {
  const user = {
    userid: req.body.user.userid,
  };
  conn.query(
    "SELECT userid FROM capdi_users WHERE userid = ?",
    [user.userid],
    function (err, row) {
      if (row[0] === undefined) {
        res.json({
          success: true,
          message: "사용 가능한 아이디 입니다.",
        });
      } else {
        res.json({
          success: false,
          message: "이미 사용 중인 아이디 입니다.",
        });
      }
    }
  );
});

//로그인
router.post("/login", function (req, res) {
  const user = {
    userid: req.body.user.userid,
    password: req.body.user.password,
  };

  conn.query(
    "SELECT user_idx, userid, name, password FROM capdi_users WHERE userid = ?",
    [user.userid],
    function (err, row) {
      if (row[0] === undefined) {
        res.json({
          // 매칭되는 아이디 없을 경우
          success: false,
          message: "ID 혹은 PW를 확인해주세요!",
        });
      }

      if (row[0] !== undefined && row[0].userid === user.userid) {
        bcrypt.compare(user.password, row[0].password, function (err, res2) {
          if (res2) {
            res.json({
              // 로그인 성공
              success: true,
              message: "로그인 성공!",
              user_idx: row[0].user_idx,
              userid: row[0].userid,
              name: row[0].name,
            });
          } else {
            res.json({
              // 매칭되는 아이디는 있으나, 비밀번호가 틀린 경우
              success: false,
              message: "ID 혹은 PW를 확인해주세요!",
            });
          }
        });
      }
    }
  );
});

// 로그인 시 등급 체크
router.get("/check/:user_idx", function (req, res) {
  conn.query(
    "select rating from capdi_users where user_idx = ?",
    [req.params.user_idx],
    function (err, row) {
      if (err) {
        console.log("Rating Check Err!!");
      } else {
        res.json({
          rating: row[0].rating,
        });
      }
    }
  );
});

// 등급 업데이트
router.get("/update/:user_idx", function (req, res) {
  if (req.params.user_idx === "1") {
    res.send("관리자 등급은 조절이 불가능합니다.");
  } else {
    conn.query(
      'UPDATE capdi_users SET rating = "우수회원" WHERE user_idx = ? and point >= 1000',
      [req.params.user_idx],
      function (err, row) {
        if (err) {
          console.log(err);
        } else {
          res.send("Update Rating Success");
        }
      }
    );
  }
});

module.exports = router;
