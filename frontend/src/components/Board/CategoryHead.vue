<template>
	<div>
		<!-- 로그인 박스 -->
		<div v-if="this.$session.get('user_idx') === undefined" class="loginBox" id="categoryhead_loginBox">
			<b-button @click="signUp" variant="outline-secondary" class="memrog" id="categoryhead_memrog">회원가입</b-button>
			<span id="categoryhead_">
				<!--<a href="#" class="idpw">아이디 ·</a>
				<a href="#" class="idpw"> 비밀번호 찾기 </a>-->
			</span>
			<b-button @click="login" variant="outline-secondary" class="logbtn" size="md">로그인</b-button>
		</div>
		<div v-else class="loginBox" id="categoryhead_loginBox">
			<b-button @click="logout" variant="outline-secondary" class="logbtn">로그아웃</b-button>
		</div>

		<!-- 게시판 설명 -->
		<div v-if="categoryNameDetail" id="categoryhead_exBox">
			<div class="card text-dark bg secondary mb-3">
				<div class="card-header">{{ categoryNameDetail }}게시판</div>
				<div class="card-body">
					<h5 class="card-title">{{ categoryName }}</h5>
					<p class="card-text">{{ categoryDetail }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		categoryName: String,
	},
	data() {
		return {
			categoryNameDetail: null,
			categoryDetail: null,
		};
	},
	created() {
		this.getCategoryDetail();
	},
	methods: {
		getCategoryDetail() {
			this.$http
				.get(`/api/board/detail/${this.categoryName}`)
				.then(res => {
					if (res.data.length === 0) {
						return;
					}
					this.categoryNameDetail = res.data[0].ca_name;
					this.categoryDetail = res.data[0].ca_detail;
				})
				.catch(() => {
					alert('알 수 없는 오류가 발생했습니다');
				});
		},
		signUp() {
			this.$router.push({
				path: '/SignUp',
				query: { redirect: this.$route.fullPath },
			});
		},
		login() {
			this.$router.push({
				path: '/login',
				query: { redirect: this.$route.fullPath },
			});
		},
		logout() {
			this.$session.destroy();
			location.reload();
		},
	},
};
</script>

<style lang="scss">
@import '../../css/CategoryHead.css';
</style>
