<template>
  <div class="container">
    <div class="row">
      <div class="col-9">
        <audio id="audio" :src="this.audio_url" v-if="this.audio_url"></audio>
        <video :src="movie.movie_url.value" width="100%" id="video" muted></video>
        <div>
          <button id="start" @click="startRecording" class="btn btn-primary">{{this.audio_url ? "取り直し" : "アテレコ開始"}}</button>
          <button id="play" @click="play" v-if="this.audio_url" class="btn btn-primary">再生</button>
          <button id="send" @click="showModal" v-if="this.audio_url" class="btn btn-primary">送信</button>

          <b-modal ref="input-name-modal" hide-footer centered title="プレイヤー名を入力">
            <div class="form-group">
              <label for="">プレイヤー</label>
              <input type="text" class="form-control" placeholder="プレイヤー1" v-model="user_name">
            </div>
            <div class="form-group">
              <b-button class="mt-3" variant="outline-danger" @click="send">送信</b-button>
            </div>
          </b-modal>
        </div>
      </div>
      <div class="col-3 bg-light">
        <h4 class="font-weight-bold">台詞</h4>
        <p>{{movie.manuscript.value}}</p>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

export default {

  async fetch({route, store}){
    await store.dispatch("movie/detail/init", route.params.id)
  },

  created() {
    this.movie_id = Number(this.$route.params.id)
  },

  data(){
    return {
      movie_id: 0,
      audioData: [],
      audio_url: '',
      audio_url2: '',
      audioBlob: {},
      audio_sample_rate: 0,
      user_name: ''
    }
  },

  computed: {
    ...mapGetters('movie/detail', ['movie']),
    ...mapGetters('record/detail', ['record', 'file'])

  },

  methods: {

    showModal() {
      this.$refs['input-name-modal'].show()
    },

    base64encode(text){
      return Buffer(text).toString("base64")
    },

    startRecording(){

      document.getElementById("video").play();
      this.audioData = []
      this.audio_url = ''
      this.audioBlob = {}
      this.audio_sample_rate = 0

      //マイク使用許可
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream)=>{
          let audioContext = new AudioContext();
          this.audio_sample_rate = audioContext.sampleRate;
          let scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
          let mediastreamsource = audioContext.createMediaStreamSource(stream);
          mediastreamsource.connect(scriptProcessor);
          scriptProcessor.onaudioprocess = this.onAudioProcess;
          scriptProcessor.connect(audioContext.destination);

          // 動画分の時間がすぎたらstopボタンを押さなくても自動的にrecord保存
          setTimeout(()=>{
            this.saveAudio();
          }, document.getElementById("video").duration*1000);
        })

    },

    stopRecording(){
      document.getElementById("video").pause();
      this.saveAudio()
    },

    saveAudio () {
      // const downloadLink = document.getElementById('download');
      // downloadLink.href = this.exportWAV(this.audioData);
      // downloadLink.download = 'test.wav';
      // downloadLink.click();
      let dataview = this.exportWAV(this.audioData);
      let audioBlob = new Blob([dataview], { type: 'audio/wav' });
      this.audioBlob = audioBlob

      const myURL = window.URL || window.webkitURL
      this.audio_url = myURL.createObjectURL(audioBlob)

    },

    send(){
      let formData = new FormData();
      formData.append('input_sound', this.audioBlob);
      formData.append('movie_id', this.movie_id);
      formData.append('user_name', this.user_name);
      this.$store.dispatch("record/detail/save", formData)
    },

    exportWAV(audioData) {

      let encodeWAV = function (samples, sampleRate) {
        let buffer = new ArrayBuffer(44 + samples.length * 2);
        let view = new DataView(buffer);

        let writeString = function (view, offset, string) {
          for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        };

        let floatTo16BitPCM = function (output, offset, input) {
          for (let i = 0; i < input.length; i++ , offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
        };

        writeString(view, 0, 'RIFF');  // RIFFヘッダ
        view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
        writeString(view, 8, 'WAVE'); // WAVEヘッダ
        writeString(view, 12, 'fmt '); // fmtチャンク
        view.setUint32(16, 16, true); // fmtチャンクのバイト数
        view.setUint16(20, 1, true); // フォーマットID
        view.setUint16(22, 1, true); // チャンネル数
        view.setUint32(24, sampleRate, true); // サンプリングレート
        view.setUint32(28, sampleRate * 2, true); // データ速度
        view.setUint16(32, 2, true); // ブロックサイズ
        view.setUint16(34, 16, true); // サンプルあたりのビット数
        writeString(view, 36, 'data'); // dataチャンク
        view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
        floatTo16BitPCM(view, 44, samples); // 波形データ

        return view;
      };

      let mergeBuffers = function (audioData) {
        let sampleLength = 0;
        for (let i = 0; i < audioData.length; i++) {
          sampleLength += audioData[i].length;
        }
        let samples = new Float32Array(sampleLength);
        let sampleIdx = 0;
        for (let i = 0; i < audioData.length; i++) {
          for (let j = 0; j < audioData[i].length; j++) {
            samples[sampleIdx] = audioData[i][j];
            sampleIdx++;
          }
        }
        return samples;
      };

      let dataview = encodeWAV(mergeBuffers(audioData), this.audio_sample_rate);
      return dataview

    },

    // save audio data
    onAudioProcess(e){
      let input = e.inputBuffer.getChannelData(0);
      let bufferData = new Float32Array(1024);
      for (var i = 0; i < 1024; i++) {
        bufferData[i] = input[i];
      }
      this.audioData.push(bufferData);
    },

    play(){
      document.getElementById("video").play();
      document.getElementById("audio").play();
    }

  }
}
</script>

<style>
</style>
