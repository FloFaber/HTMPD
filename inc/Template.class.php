class Template
{

  private string $file;
  private array $data;

  public function __construct(string $file, array $data = []){
    if(!file_exists($file)){
      throw new Exception("File not found");
    }
    $this->file = $file;
    $this->data = $data;
  }

  public function __toString(){
    $file_content = file_get_contents($file);
    foreach($data as $k => $v){
      str_replace("{{".$k."}}", $v, $file_content);
    }
    return $file_content;
  }

}
