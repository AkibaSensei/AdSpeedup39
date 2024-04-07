const PLAYBACK_RATE_MAX = 16;
const IS_SKIP_AD = true;
let currentMuted = false;
let currentPlaybackRate = 1;
function adSpeedup(video) {
	const callback = (mutations) => {
		if (IS_SKIP_AD) {
			const clickSkipButton = (container, button) => {
				const skipButtonContainer = document.querySelector(container);
				if (skipButtonContainer && skipButtonContainer.style.display !== "none") {
					const skipButton = skipButtonContainer.querySelector(container + " > " + button);
					if (skipButton) {
						skipButton.click();
					}
				}
			}
			mutations.forEach((mutation) => {
				if (mutation.attributeName !== "style") {
					return;
				}
				clickSkipButton(".ytp-ad-skip-button-container", ".ytp-ad-skip-button-modern");
				clickSkipButton(".ytp-skip-ad", ".ytp-skip-ad-button");
			});
		}
		if (video.playbackRate !== PLAYBACK_RATE_MAX) {
			currentMuted = video.muted;
			currentPlaybackRate = video.playbackRate;
		}
		const isAdShowing = movie_player.classList.contains("ad-showing") || movie_player.classList.contains("ad-interrupting");
		video.muted = isAdShowing ? true : currentMuted;
		video.playbackRate = isAdShowing ? PLAYBACK_RATE_MAX : currentPlaybackRate;
	}
	new MutationObserver(callback).observe(movie_player, {
		attributeFilter: ["class", "style"],
		attributes: true,
		subtree: true,
	});
}

function run() {
	const video = document.querySelector("#movie_player video");
	if (video) {
		adSpeedup(video);
	} else {
		setTimeout(run, 100);
	}
}

window.addEventListener("load", function() {
	run();
});
